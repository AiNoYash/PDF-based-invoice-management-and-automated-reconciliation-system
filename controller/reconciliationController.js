const db = require('../config/db');

/* ── helpers ── */
const safeNum  = (v) => { const n = Number(v); return isNaN(n) ? null : n; };
const safeDate = (v) => { const d = new Date(v); return isNaN(d) ? null : d; };

/* ════════════════════════════════════════════════════════
   runReconciliation
   4-tier: InvoiceID → Amount+ExactDate → Amount+PartialDate → Unmatched
   Iterates LEDGER invoices so every invoice appears in results.
   ════════════════════════════════════════════════════════ */
const runReconciliation = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { ledgerId, bankStatementGroupId } = req.body;
        if (!ledgerId || !bankStatementGroupId)
            return res.status(400).json({ message: 'Missing ledgerId or bankStatementGroupId' });

        /* -- bank statement group meta -- */
        const [grpRows] = await conn.execute(
            `SELECT id, bank_account_id, target_month, target_year
             FROM bank_statement_groups WHERE id = ?`,
            [bankStatementGroupId]
        );
        if (!grpRows.length)
            return res.status(404).json({ message: 'Bank statement group not found' });

        const { id: reconGroupId, bank_account_id, target_month, target_year } = grpRows[0];

        /* -- fetch & sort ledger records (amount DESC, date ASC) -- */
        const [ledgerRecords] = await conn.execute(
            `SELECT id, transaction_id, transaction_date, amount, transaction_type, description
             FROM ledger_records WHERE ledger_id = ?
             ORDER BY amount DESC, transaction_date ASC`,
            [ledgerId]
        );

        /* -- fetch & sort bank records (amount DESC, date ASC) -- */
        const [bankRecords] = await conn.execute(
            `SELECT id, transaction_id, transaction_date, amount, transaction_type, description
             FROM bank_statement_records WHERE bank_statement_group_id = ?
             ORDER BY amount DESC, transaction_date ASC`,
            [bankStatementGroupId]
        );

        /* -- build bank lookup maps to avoid O(n²) -- */
        const usedBankIds = new Set();

        /* helper: find best unused bank record by txnId match */
        const findByInvoiceId = (invoiceId) => {
            if (!invoiceId) return null;
            const needle = invoiceId.toLowerCase();
            return bankRecords.find(b =>
                !usedBankIds.has(b.id) && (
                    (b.transaction_id || '').toLowerCase() === needle ||
                    (b.description   || '').toLowerCase().includes(needle)
                )
            ) || null;
        };

        /* helper: find best unused bank record by amount + date */
        const findByAmountDate = (ledgerAmount, ledgerDate) => {
            let best = null, bestPct = -1;
            for (const b of bankRecords) {
                if (usedBankIds.has(b.id)) continue;
                const bAmt  = safeNum(b.amount);
                const bDate = safeDate(b.transaction_date);
                if (bAmt === null || bDate === null) continue;
                if (Math.abs(bAmt - ledgerAmount) > 0.01) continue;   // amount must match
                const diffDays = Math.abs(bDate - ledgerDate) / 86400000;
                const pct = Math.max(0, 100 - (diffDays / 31) * 100);
                if (pct > bestPct) { bestPct = pct; best = b; }
            }
            return best ? { record: best, pct: bestPct } : null;
        };

        /* -- delete old results for this reconciliation group -- */
        await conn.execute(
            `DELETE FROM reconciliation_results WHERE reconciliation_id = ?`,
            [reconGroupId]
        );

        const toInsert = [];
        const summary  = { matched: 0, partial: 0, unmatched: 0 };

        /* ── Main loop: iterate LEDGER invoices ── */
        for (const ledger of ledgerRecords) {
            const invoiceId   = ledger.transaction_id || null;
            const ledgerAmt   = safeNum(ledger.amount);
            const ledgerDate  = safeDate(ledger.transaction_date);

            let matchedBank   = null;
            let resultScore   = 0;

            /* Tier 1 — Invoice ID match */
            const t1 = findByInvoiceId(invoiceId);
            if (t1) {
                matchedBank = t1;
                resultScore = 100;
                usedBankIds.add(t1.id);
                summary.matched++;
            }

            /* Tier 2 & 3 — Amount + date match (exact date = 100, variance = partial) */
            if (!matchedBank && ledgerAmt !== null && ledgerDate !== null) {
                const t23 = findByAmountDate(ledgerAmt, ledgerDate);
                if (t23) {
                    matchedBank = t23.record;
                    resultScore = Math.round(t23.pct);
                    usedBankIds.add(t23.record.id);
                    if (resultScore >= 100) { resultScore = 100; summary.matched++;  }
                    else                   {                     summary.partial++;  }
                }
            }

            /* Tier 4 — Unmatched */
            if (!matchedBank) summary.unmatched++;

            toInsert.push([
                reconGroupId,
                ledger.id,
                matchedBank ? matchedBank.id : null,
                invoiceId,
                ledger.description || null,
                ledger.transaction_type || null,
                ledgerAmt,
                matchedBank ? safeNum(matchedBank.amount) : null,
                matchedBank ? (matchedBank.transaction_id || null) : null,
                resultScore
            ]);
        }

        /* -- batch insert -- */
        if (toInsert.length > 0) {
            await conn.query(
                `INSERT INTO reconciliation_results
                 (reconciliation_id, ledger_record_id, bank_statement_record_id,
                  invoice_id, description, transaction_type,
                  invoice_amount, bank_amount, bank_txn_id, result)
                 VALUES ?`,
                [toInsert]
            );
        }

        /* -- mark reconciliation group completed -- */
        await conn.execute(
            `UPDATE reconciliation_groups
             SET status = 'completed', completed_at = NOW()
             WHERE id = ?`,
            [reconGroupId]
        );

        conn.release();
        return res.status(200).json({
            message: 'Reconciliation completed successfully',
            reconId: reconGroupId,
            summary
        });

    } catch (err) {
        conn.release();
        console.error('Reconciliation error:', err);
        return res.status(500).json({ message: 'Server error during reconciliation', error: err.message });
    }
};

/* ════════════════════════════════════════════════════════
   getReconciliations — list all runs for this business
   ════════════════════════════════════════════════════════ */
const getReconciliations = async (req, res) => {
    try {
        const businessId = req.user?.businessId || req.user?.business_id;
        if (!businessId)
            return res.status(400).json({ message: 'Business ID not found in token' });

        const [rows] = await db.execute(
            `SELECT rg.id, rg.status, rg.created_at, rg.completed_at,
                    l.target_month, l.target_year,
                    ba.bank_name, ba.account_nickname,
                    (SELECT COUNT(*) FROM reconciliation_results rr WHERE rr.reconciliation_id = rg.id AND rr.result = 100)  AS matched_count,
                    (SELECT COUNT(*) FROM reconciliation_results rr WHERE rr.reconciliation_id = rg.id AND rr.result > 0 AND rr.result < 100) AS partial_count,
                    (SELECT COUNT(*) FROM reconciliation_results rr WHERE rr.reconciliation_id = rg.id AND rr.result = 0)   AS unmatched_count,
                    (SELECT COUNT(*) FROM reconciliation_results rr WHERE rr.reconciliation_id = rg.id)                     AS total_count
             FROM reconciliation_groups rg
             JOIN ledgers             l   ON rg.ledger_id             = l.id
             JOIN bank_accounts       ba  ON l.bank_account_id        = ba.id
             JOIN businesses          b   ON ba.business_id           = b.id
             WHERE b.id = ?
             ORDER BY rg.created_at DESC`,
            [businessId]
        );

        return res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('getReconciliations error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

/* ════════════════════════════════════════════════════════
   getResults — fetch all result rows for one reconciliation run
   ════════════════════════════════════════════════════════ */
const getResults = async (req, res) => {
    try {
        const { reconId } = req.params;
        const [rows] = await db.execute(
            `SELECT id, invoice_id, description, transaction_type,
                    invoice_amount, bank_amount, bank_txn_id, result
             FROM reconciliation_results
             WHERE reconciliation_id = ?
             ORDER BY result DESC, id ASC`,
            [reconId]
        );
        return res.status(200).json({ success: true, results: rows });
    } catch (err) {
        console.error('getResults error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = { runReconciliation, getReconciliations, getResults };
