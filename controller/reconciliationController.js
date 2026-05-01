const db = require('../config/db');

// Helper to detect if a description looks like it contains an invoice number
// e.g. "INV-1234", "Invoice # 567", "Ref 890"
const containsInvoiceLikeString = (desc) => {
    return /(?:inv|invoice|ref|bill|#)[\s-]*[a-z0-9_-]+/i.test(desc || '');
};

const runReconciliation = async (req, res) => {
    try {
        const { ledgerId, bankStatementGroupId } = req.body;

        if (!ledgerId || !bankStatementGroupId) {
            return res.status(400).json({ message: 'Missing ledgerId or bankStatementGroupId' });
        }

        // Fetch Bank Statement Group details
        const [groupRows] = await db.execute(
            `SELECT bank_account_id, target_month, target_year 
             FROM bank_statement_groups WHERE id = ?`,
            [bankStatementGroupId]
        );

        if (groupRows.length === 0) {
            return res.status(404).json({ message: 'Bank statement group not found' });
        }
        const { bank_account_id, target_month, target_year } = groupRows[0];

        // Fetch Ledger Records (Invoices)
        const [ledgerRecords] = await db.execute(
            `SELECT id, transaction_id, transaction_date, amount, transaction_type, description 
             FROM ledger_records WHERE ledger_id = ?
             ORDER BY amount DESC, transaction_date ASC`,
            [ledgerId]
        );

        // Fetch Bank Statement Records
        const [bankRecords] = await db.execute(
            `SELECT id, transaction_id, transaction_date, amount, transaction_type, description 
             FROM bank_statement_records WHERE bank_statement_group_id = ?
             ORDER BY amount DESC, transaction_date ASC`,
            [bankStatementGroupId]
        );

        const matched = [];
        const partiallyMatched = [];
        const unmatched = [];
        const resultsToInsert = [];

        // Track which ledger records are already matched to avoid double-matching
        const matchedLedgerRecordIds = new Set();

        for (const bankRecord of bankRecords) {
            const desc = (bankRecord.description || '').toLowerCase();
            const invNum = (bankRecord.invoice_number || '').toLowerCase();
            const bankAmount = Number(bankRecord.amount);
            const bankDate = new Date(bankRecord.transaction_date);

            let foundExactLedgerMatch = null;
            let looksLikeHasInvoice = false;

            // 1. Check if invoice number exists
            if (invNum) {
                looksLikeHasInvoice = true;
            } else if (containsInvoiceLikeString(desc)) {
                looksLikeHasInvoice = true;
            }

            // Attempt to match against all available ledger records
            for (const ledger of ledgerRecords) {
                if (matchedLedgerRecordIds.has(ledger.id)) continue;

                const ledgerTxnId = (ledger.transaction_id || '').toLowerCase();
                
                // If explicit invoice number matches
                if (invNum && ledgerTxnId && invNum === ledgerTxnId) {
                    foundExactLedgerMatch = ledger;
                    break;
                }

                // If ledger invoice number is found inside the bank description
                if (ledgerTxnId && desc.includes(ledgerTxnId)) {
                    foundExactLedgerMatch = ledger;
                    // We definitely found an invoice number since it exactly matches a ledger
                    looksLikeHasInvoice = true; 
                    break;
                }
            }

            if (foundExactLedgerMatch) {
                // If it does match -> directly give it in matched records
                matched.push({
                    bankRecord,
                    ledgerRecord: foundExactLedgerMatch,
                    matchReason: 'Exact Invoice Match'
                });
                matchedLedgerRecordIds.add(foundExactLedgerMatch.id);
                resultsToInsert.push([
                    foundExactLedgerMatch.transaction_id || String(foundExactLedgerMatch.id),
                    100,
                    bank_account_id,
                    target_month,
                    target_year
                ]);
            } else if (looksLikeHasInvoice) {
                let extractedInvoiceNum = invNum;
                if (!extractedInvoiceNum) {
                    const match = desc.match(/(?:inv|invoice|ref|bill|#)[\s-]*([a-z0-9_-]+)/i);
                    extractedInvoiceNum = match ? match[1] : null;
                }

                // If invoice number exists but invoice is not in ledger -> unmatched
                unmatched.push({
                    bankRecord,
                    reason: 'Invoice number detected but not found in ledger'
                });
                resultsToInsert.push([
                    extractedInvoiceNum || bankRecord.transaction_id || null,
                    0,
                    bank_account_id,
                    target_month,
                    target_year
                ]);
            } else {
                // If invoice does not exist -> check amount
                let bestPartialMatch = null;
                let bestMatchPercentage = -1;

                for (const ledger of ledgerRecords) {
                    if (matchedLedgerRecordIds.has(ledger.id)) continue;

                    const ledgerAmount = Number(ledger.amount);
                    
                    // If amount matches
                    if (ledgerAmount === bankAmount) {
                        const ledgerDate = new Date(ledger.transaction_date);
                        
                        // calc difference between dates in invoice and bank statement
                        const diffInTime = Math.abs(bankDate - ledgerDate);
                        const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

                        // calculate partial matched % by (100-(diff/31) *100)
                        let percentage = 100 - ((diffInDays / 31) * 100);
                        if (percentage < 0) percentage = 0; // Cap at 0%

                        // Find the best partial match if there are multiple same amounts
                        if (percentage > bestMatchPercentage) {
                            bestMatchPercentage = percentage;
                            bestPartialMatch = ledger;
                        }
                    }
                }

                if (bestPartialMatch) {
                    // accordingly add partially matched
                    partiallyMatched.push({
                        bankRecord,
                        ledgerRecord: bestPartialMatch,
                        matchPercentage: bestMatchPercentage.toFixed(2),
                        matchReason: `Amount matched exactly. Date variance percentage: ${bestMatchPercentage.toFixed(2)}%`
                    });
                    matchedLedgerRecordIds.add(bestPartialMatch.id);
                    resultsToInsert.push([
                        bestPartialMatch.transaction_id || String(bestPartialMatch.id),
                        bestMatchPercentage,
                        bank_account_id,
                        target_month,
                        target_year
                    ]);
                } else {
                    // If amount is not matched -> gets added in unmatched
                    unmatched.push({
                        bankRecord,
                        reason: 'No invoice number detected, and amount does not match any ledger record'
                    });
                    resultsToInsert.push([
                        bankRecord.transaction_id || null,
                        0,
                        bank_account_id,
                        target_month,
                        target_year
                    ]);
                }
            }
        }

        // Clear previous results for this account, month, year
        await db.execute(
            `DELETE FROM reconciliation_results WHERE bank_account_id = ? AND target_month = ? AND target_year = ?`,
            [bank_account_id, target_month, target_year]
        );

        // Batch insert results
        if (resultsToInsert.length > 0) {
            await db.query(
                `INSERT INTO reconciliation_results (invoice_id, matching_rate, bank_account_id, target_month, target_year) VALUES ?`,
                [resultsToInsert]
            );
        }

        res.status(200).json({
            message: 'Reconciliation algorithm executed successfully',
            summary: {
                totalBankRecords: bankRecords.length,
                matchedCount: matched.length,
                partiallyMatchedCount: partiallyMatched.length,
                unmatchedCount: unmatched.length
            },
            matched,
            partiallyMatched,
            unmatched
        });

    } catch (error) {
        console.error('Reconciliation error:', error);
        res.status(500).json({ message: 'Server error during reconciliation' });
    }
};

module.exports = {
    runReconciliation
};
