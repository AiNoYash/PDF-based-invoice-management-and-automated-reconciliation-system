import { useParams } from "react-router-dom";
import "./ReconciliationDetails.css";
import { useState, useEffect, useRef, useCallback } from "react";
import useAuthStore from "../../../../store/useAuthStore";

/* ─── helpers ─── */
const formatCurrency = (val) => {
    if (val === null || val === undefined || val === '') return '—';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', minimumFractionDigits: 2
    }).format(val);
};

const getStatus = (r) => {
    if (r === 100) return { label: '✓ Matched',   cls: 'status-matched'   };
    if (r === 0)   return { label: '✗ Unmatched', cls: 'status-unmatched' };
    return                 { label: '~ Partial',   cls: 'status-partial'   };
};

/* ─── column definitions ─── */
const COLS = [
    { key: 'index',          label: '#',              defaultW: 55  },
    { key: 'invoice_id',     label: 'Invoice ID',     defaultW: 160 },
    { key: 'description',    label: 'Description',    defaultW: 260 },
    { key: 'type',           label: 'Type',           defaultW: 110 },
    { key: 'invoice_amount', label: 'Invoice Amount', defaultW: 155 },
    { key: 'bank_txn_id',    label: 'Bank TXN ID',    defaultW: 150 },
    { key: 'bank_amount',    label: 'Bank Amount',    defaultW: 155 },
    { key: 'match_pct',      label: 'Match %',        defaultW: 165 },
    { key: 'status',         label: 'Status',         defaultW: 140 },
];
const MIN_W = 60;

export function ReconciliationDetails() {
    const { id: reconId } = useParams();
    const token = useAuthStore(s => s.token);

    const [results,  setResults] = useState([]);
    const [loading,  setLoading] = useState(true);
    const [error,    setError]   = useState('');
    const [filter,   setFilter]  = useState('all');
    const [search,   setSearch]  = useState('');
    const [widths,   setWidths]  = useState(() => COLS.map(c => c.defaultW));

    /* ── fetch ── */
    useEffect(() => {
        if (!reconId) return;
        (async () => {
            try {
                setLoading(true); setError('');
                const res  = await fetch(
                    `http://localhost:8085/api/v1/reconciliation/results/${reconId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setResults(data.results || []);
            } catch (e) { setError('Failed to load results.'); }
            finally     { setLoading(false); }
        })();
    }, [reconId, token]);

    /* ── column resize ── */
    const drag = useRef(null);

    const startDrag = useCallback((e, i) => {
        e.preventDefault();
        drag.current = { i, x0: e.clientX, w0: widths[i] };
        document.body.style.cursor     = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [widths]);

    useEffect(() => {
        const onMove = (e) => {
            if (!drag.current) return;
            const { i, x0, w0 } = drag.current;
            const newW = Math.max(MIN_W, w0 + e.clientX - x0);
            setWidths(prev => prev.map((w, idx) => idx === i ? newW : w));
        };
        const onUp = () => {
            if (!drag.current) return;
            drag.current = null;
            document.body.style.cursor     = '';
            document.body.style.userSelect = '';
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup',   onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup',   onUp);
        };
    }, []);

    /* ── filter / search ── */
    const matchedC   = results.filter(r => r.result === 100).length;
    const partialC   = results.filter(r => r.result > 0 && r.result < 100).length;
    const unmatchedC = results.filter(r => r.result === 0).length;

    const visible = results
        .filter(r => {
            if (filter === 'matched')   return r.result === 100;
            if (filter === 'partial')   return r.result > 0 && r.result < 100;
            if (filter === 'unmatched') return r.result === 0;
            return true;
        })
        .filter(r => {
            const q = search.toLowerCase();
            return !q ||
                (r.invoice_id  || '').toLowerCase().includes(q) ||
                (r.description || '').toLowerCase().includes(q) ||
                (r.bank_txn_id || '').toLowerCase().includes(q);
        });

    const totalW = widths.reduce((s, w) => s + w, 0);

    /* ── td cell style — same width as its th ── */
    const cell = (i) => ({
        width:    widths[i],
        minWidth: widths[i],
        maxWidth: widths[i],
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    });

    return (
        <div className="recon-page">

            {/* ── top bar ── */}
            <div className="recon-bar">
                <div className="recon-tabs">
                    {[
                        { k: 'all',       label: 'All',       n: results.length                },
                        { k: 'matched',   label: 'Matched',   n: matchedC,   color: '#22c55e' },
                        { k: 'partial',   label: 'Partial',   n: partialC,   color: '#f59e0b' },
                        { k: 'unmatched', label: 'Unmatched', n: unmatchedC, color: '#ef4444' },
                    ].map(t => (
                        <button
                            key={t.k}
                            className={`rtab ${filter === t.k ? 'rtab-on' : ''}`}
                            onClick={() => setFilter(t.k)}
                        >
                            {t.label}
                            <span className="rbadge" style={{ background: t.color || '#6b7280' }}>{t.n}</span>
                        </button>
                    ))}
                </div>
                <div className="rsearch">
                    <span>🔍</span>
                    <input
                        placeholder="Search invoice, description..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p className="rmsg">Loading results…</p>}
            {error   && <p className="rmsg rerr">{error}</p>}

            {!loading && !error && (
                <>
                    {/* ── table wrapper ── */}
                    <div className="recon-scroll">
                        <table
                            className="recon-tbl"
                            style={{ width: totalW, minWidth: totalW }}
                        >
                            {/* ── HEADER ── */}
                            <thead>
                                <tr>
                                    {COLS.map((col, i) => (
                                        <th
                                            key={col.key}
                                            style={{
                                                width:    widths[i],
                                                minWidth: widths[i],
                                                maxWidth: widths[i],
                                                position: 'relative',
                                            }}
                                        >
                                            <span className="th-txt">{col.label}</span>
                                            {i < COLS.length - 1 && (
                                                <span
                                                    className="rhandle"
                                                    onMouseDown={e => startDrag(e, i)}
                                                />
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* ── BODY ── */}
                            <tbody>
                                {visible.length === 0 ? (
                                    <tr>
                                        <td colSpan={COLS.length} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                            No records match your filter or search.
                                        </td>
                                    </tr>
                                ) : visible.map((row, idx) => {
                                    const st       = getStatus(row.result);
                                    const isCredit = (row.transaction_type || '').toLowerCase() === 'credit';
                                    const barColor = row.result === 100 ? '#22c55e' : row.result === 0 ? '#ef4444' : '#f59e0b';

                                    return (
                                        <tr key={row.id} className={`rrow ${st.cls}`}>
                                            {/* # */}
                                            <td style={cell(0)} className="idx">{idx + 1}</td>

                                            {/* Invoice ID */}
                                            <td style={cell(1)} title={row.invoice_id || ''} className="mono">
                                                {row.invoice_id || '—'}
                                            </td>

                                            {/* Description */}
                                            <td style={cell(2)} title={row.description || ''}>
                                                {row.description || '—'}
                                            </td>

                                            {/* Type */}
                                            <td style={cell(3)}>
                                                <span className={isCredit ? 'tcredit' : 'tdebit'}>
                                                    {isCredit ? '↑ Credit' : '↓ Debit'}
                                                </span>
                                            </td>

                                            {/* Invoice Amount */}
                                            <td style={{ ...cell(4), textAlign: 'right', fontWeight: 600 }}>
                                                {formatCurrency(row.invoice_amount)}
                                            </td>

                                            {/* Bank TXN ID */}
                                            <td style={cell(5)} title={row.bank_txn_id || ''} className="mono">
                                                {row.bank_txn_id || '—'}
                                            </td>

                                            {/* Bank Amount */}
                                            <td style={{ ...cell(6), textAlign: 'right', fontWeight: 600 }}>
                                                {formatCurrency(row.bank_amount)}
                                            </td>

                                            {/* Match % */}
                                            <td style={cell(7)}>
                                                <div className="mbar-wrap">
                                                    <div className="mbar-track">
                                                        <div className="mbar-fill" style={{ width: `${row.result}%`, background: barColor }} />
                                                    </div>
                                                    <span className="mbar-pct" style={{ color: barColor }}>{row.result}%</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td style={cell(8)}>
                                                <span className={`sbadge ${st.cls}`}>{st.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p className="rfooter">Showing {visible.length} of {results.length} records</p>
                </>
            )}
        </div>
    );
}