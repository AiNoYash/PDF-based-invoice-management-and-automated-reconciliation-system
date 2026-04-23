import React, { useState, useEffect } from 'react';
import './LedgerCollectionPage.css';
import { Link, useOutletContext } from 'react-router-dom';


import { CreateLedgerModal } from "./components/CreateLedgerModal";



const mockLedgers = [
  {
    id: 1,
    name: "April Sales Invoices",
    bankAccount: "Chase Business **** **** **** 4219",
    month: "April",
    year: "2026",
    entries: 142,
    createdAt: "12 April, 2026"
  },
  {
    id: 2,
    name: "Q1 Marketing Expenses",
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

export const LedgerCollectionPage = () => {

  const { showCreateModalOverlay, setShowCreateModalOverlay } = useOutletContext();

  return (
    <>
      {showCreateModalOverlay && <CreateLedgerModal isOpen={showCreateModalOverlay} onClose={() => { setShowCreateModalOverlay(false); }} />}

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
            {mockLedgers.map((ledger) => (
              <tr key={ledger.id} onClick={()=>{
                
              }}>
                <td className="cell-name">{ledger.name}</td>
                <td className="cell-bank">{ledger.bankAccount}</td>
                <td>{ledger.month} {ledger.year}</td>
                <td className="cell-entries">{ledger.entries}</td>
                <td>{ledger.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  );
};

