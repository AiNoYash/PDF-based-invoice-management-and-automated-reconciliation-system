import { useParams } from "react-router-dom";
import "./StatementGroupDetails.css";
import { useState } from "react";

const initialMockTransactions = {
    1: [
        { id: 't1', transactionId: 'TXN-001', reconciled: 'Yes', date: '2026-04-10', debit: '1500.00', credit: '', description: 'Client Payment - Acme Corp', fileName: 'inv-acme-01.pdf' },
        { id: 't2', transactionId: 'TXN-002', reconciled: 'No', date: '2026-04-11', debit: '', credit: '250.00', description: 'Office Supplies', fileName: 'receipt-staples.pdf' },
    ],
    2: [
        { id: 't3', transactionId: 'TXN-003', reconciled: 'Yes', date: '2026-03-15', debit: '5000.00', credit: '', description: 'Q1 Ad Spend Allocation', fileName: null },
    ],
    3: []
};


export function StatementGroupDetails() {
    const { id } = useParams();
    const [transactions, setTransactions] = useState(initialMockTransactions[id] || []);

    const handleTransactionUpdate = (id, field, value) => {
        setTransactions(prev => prev.map(txn =>
            txn.id === id ? { ...txn, [field]: value } : txn
        ));
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now().toString(), // Generate a unique ID for the new row
            transactionId: '',
            reconciled: 'No',
            date: '',
            debit: '',
            credit: '',
            description: '',
            fileName: ''
        };
        setTransactions([...transactions, newRow]);
    };


    return (
        <>
            <div className="transactions-view">
                <div className="ledger-table-container">
                    <table className="ledger-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Transaction ID</th>
                                <th style={{ width: '120px' }}>Reconciled</th>
                                <th style={{ width: '150px' }}>Date</th>
                                <th style={{ width: '120px' }}>Debit</th>
                                <th style={{ width: '120px' }}>Credit</th>
                                <th>Description</th>
                                <th>File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={txn.id}>
                                    <td>{index + 1}</td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            defaultValue={txn.transactionId}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'transactionId', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <select
                                            className="editable-input"
                                            defaultValue={txn.reconciled}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'reconciled', e.target.value)}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="date"
                                            defaultValue={txn.date}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'date', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="number"
                                            placeholder="0.00"
                                            defaultValue={txn.debit}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'debit', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="number"
                                            placeholder="0.00"
                                            defaultValue={txn.credit}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'credit', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            placeholder="Enter description..."
                                            defaultValue={txn.description}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            placeholder="Optional file..."
                                            defaultValue={txn.fileName || ''}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'fileName', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="add-row-btn" onClick={handleAddRow}>
                    {/* <Plus size={18} />  */}
                    Add New Entry
                </button>
            </div>
        </>
    );
}