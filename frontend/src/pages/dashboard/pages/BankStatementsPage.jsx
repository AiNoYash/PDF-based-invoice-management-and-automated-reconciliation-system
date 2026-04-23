import React from 'react';
import './BankStatementsPage.css';
import { useOutletContext, useNavigate } from 'react-router-dom';

import { CreateBankStatementGroupModal } from "./components/CreateBankStatementGroupModal";

const mockBankStatements = [
  {
    id: 1,
    name: "April Sales Statements",
    bankAccount: "Chase Business **** **** **** 4219",
    month: "April",
    year: "2026",
    entries: 142,
    createdAt: "12 April, 2026"
  },
  {
    id: 2,
    name: "Q1 Marketing Statements",
    bankAccount: "BoA Checking **** **** **** 8821",
    month: "March",
    year: "2026",
    entries: 89,
    createdAt: "05 April, 2026"
  },
  {
    id: 3,
    name: "Payroll March 2026",
    bankAccount: "Wells Fargo Ops **** **** **** 1105",
    month: "March",
    year: "2026",
    entries: 45,
    createdAt: "01 April, 2026"
  }
];

export const BankStatementsPage = () => {
  const { showCreateModalOverlay, setShowCreateModalOverlay } = useOutletContext();
  const navigate = useNavigate();

  return (
    <>
      {showCreateModalOverlay && (
        <CreateBankStatementGroupModal 
          isOpen={showCreateModalOverlay} 
          onClose={() => setShowCreateModalOverlay(false)} 
        />
      )}

      <div className="ledger-table-container">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Bank Account</th>
              <th>Period</th>
              <th>Entries</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {mockBankStatements.map((statement) => (
              <tr key={statement.id} onClick={() => navigate(statement.id.toString())}>
                <td className="cell-name">{statement.name}</td>
                <td className="cell-bank">{statement.bankAccount}</td>
                <td>{statement.month} {statement.year}</td>
                <td className="cell-entries">{statement.entries}</td>
                <td>{statement.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};