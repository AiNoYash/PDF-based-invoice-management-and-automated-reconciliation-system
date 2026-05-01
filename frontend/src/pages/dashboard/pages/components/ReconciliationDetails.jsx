import { useParams } from "react-router-dom";
import "./ReconciliationDetails.css";
import { useState } from "react";

// Mock data to represent available records for selection
const availableLedgerRecords = [
    { id: 'lr1', transactionId: 'L-TXN-001', description: 'Client Payment - Acme Corp' },
    { id: 'lr2', transactionId: 'L-TXN-002', description: 'Office Supplies Vendor' },
    { id: 'lr3', transactionId: 'L-TXN-003', description: 'Q1 Ad Spend Allocation' }
];

const availableBankRecords = [
    { id: 'br1', transactionId: 'B-TXN-901', description: 'WIRE INBOUND ACME CORP' },
    { id: 'br2', transactionId: 'B-TXN-902', description: 'DEBIT CARD STAPLES' },
    { id: 'br3', transactionId: 'B-TXN-903', description: 'ACH OUT GOOGLE ADS' }
];

const initialMockMatches = {
    1: [
        { id: 'm1', ledgerRecordId: 'lr1', bankStatementRecordId: 'br1', matchType: 'auto_exact' },
        { id: 'm2', ledgerRecordId: 'lr2', bankStatementRecordId: 'br2', matchType: 'manual' },
    ],
    2: [
        { id: 'm3', ledgerRecordId: 'lr3', bankStatementRecordId: 'br3', matchType: 'auto_partial' },
    ],
    3: []
};

export function ReconciliationDetails() {
    const { id } = useParams();
    const [matches, setMatches] = useState(initialMockMatches[id] || []);

    const handleMatchUpdate = (id, field, value) => {
        setMatches(prev => prev.map(match =>
            match.id === id ? { ...match, [field]: value } : match
        ));
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now().toString(),
            ledgerRecordId: '',
            bankStatementRecordId: '',
            matchType: 'manual'
        };
        setMatches([...matches, newRow]);
    };

    // Helper functions to get descriptions based on selected IDs
    const getLedgerDescription = (recordId) => {
        return availableLedgerRecords.find(r => r.id === recordId)?.description || '';
    };

    const getBankDescription = (recordId) => {
        return availableBankRecords.find(r => r.id === recordId)?.description || '';
    };

    return (
        <>
            <div className="transactions-view">
                <div className="statement-table-container">
                    <table className="statement-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Ledger Transaction ID</th>
                                <th>Ledger Description</th>
                                <th>Bank Transaction ID</th>
                                <th>Bank Description</th>
                                <th style={{ width: '150px' }}>Match Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map((match, index) => (
                                <tr key={match.id}>
                                    <td>{index + 1}</td>
                                    
                                    <td className="editable-cell">
                                        <select
                                            className="editable-input"
                                            value={match.ledgerRecordId}
                                            onChange={(e) => handleMatchUpdate(match.id, 'ledgerRecordId', e.target.value)}
                                        >
                                            <option value="" disabled>Select Ledger Txn...</option>
                                            {availableLedgerRecords.map(record => (
                                                <option key={record.id} value={record.id}>
                                                    {record.transactionId}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    
                                    <td>{getLedgerDescription(match.ledgerRecordId)}</td>

                                    <td className="editable-cell">
                                        <select
                                            className="editable-input"
                                            value={match.bankStatementRecordId}
                                            onChange={(e) => handleMatchUpdate(match.id, 'bankStatementRecordId', e.target.value)}
                                        >
                                            <option value="" disabled>Select Bank Txn...</option>
                                            {availableBankRecords.map(record => (
                                                <option key={record.id} value={record.id}>
                                                    {record.transactionId}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>{getBankDescription(match.bankStatementRecordId)}</td>

                                    <td className="editable-cell">
                                        <select
                                            className="editable-input"
                                            value={match.matchType}
                                            onChange={(e) => handleMatchUpdate(match.id, 'matchType', e.target.value)}
                                        >
                                            <option value="auto_exact">Auto Exact</option>
                                            <option value="auto_partial">Auto Partial</option>
                                            <option value="manual">Manual</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="add-row-btn" onClick={handleAddRow}>
                    Add New Match
                </button>
            </div>
        </>
    );
}