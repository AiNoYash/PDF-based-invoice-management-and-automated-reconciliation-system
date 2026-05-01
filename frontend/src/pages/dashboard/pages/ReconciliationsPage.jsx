import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CreateReconcilationsModel } from "./components/CreateReconciliationModel";

const mockReconciliations = [
  {
    id: 1,
    ledgerName: "April Sales Invoices",
    bankStatementGroupName: "Chase Business April 2026",
    status: "In Progress",
    matched: 120,
    pending: 22,
    createdAt: "12 April, 2026"
  },
  {
    id: 2,
    ledgerName: "Q1 Marketing Expenses",
    bankStatementGroupName: "BoA Checking Q1 2026",
    status: "Complete",
    matched: 89,
    pending: 0,
    createdAt: "05 April, 2026"
  },
  {
    id: 3,
    ledgerName: "Payroll March 2026",
    bankStatementGroupName: "Wells Fargo Ops March 2026",
    status: "In Progress",
    matched: 15,
    pending: 30,
    createdAt: "01 April, 2026"
  }
];

export function ReconciliationsPage() {
    const { showCreateModalOverlay, setShowCreateModalOverlay } = useOutletContext();
    const navigate = useNavigate();

    return (
        <>
            {showCreateModalOverlay && (
                <CreateReconcilationsModel 
                    isOpen={showCreateModalOverlay} 
                    onClose={() => { setShowCreateModalOverlay(false); }} 
                />
            )}

            <div className="ledger-table-container">
                <table className="ledger-table">
                    <thead>
                        <tr>
                            <th>Ledger Name</th>
                            <th>Bank Statement Group</th>
                            <th>Status</th>
                            <th>Matched</th>
                            <th>Pending</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockReconciliations.map((recon) => (
                            <tr key={recon.id} onClick={() => { navigate(recon.id.toString()); }}>
                                <td className="cell-name">{recon.ledgerName}</td>
                                <td className="cell-bank">{recon.bankStatementGroupName}</td>
                                <td>{recon.status}</td>
                                <td>{recon.matched}</td>
                                <td>{recon.pending}</td>
                                <td>{recon.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}