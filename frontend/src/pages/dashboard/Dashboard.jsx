import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Dashboard.css';
import { CreateLedgerModal } from './pages/components/CreateLedgerModal';

const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
);

const titles = {
  "Dashboard": "Overview",
  "LedgerCollection": "Ledgers",
  "BankStatements": "Bank Statements",
  "Reconciliations": "Reconciliations",
  "Settings": "Settings",
}

function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [showCreateModalOverlay, setShowCreateModalOverlay] = useState(false);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h2>{titles[currentPage]}</h2>
          </div>

          {
            currentPage === "Dashboard" || currentPage === "Settings" ? null :
              <div className="topbar-right">
                <Link className="btn-upload-primary" onClick={() => {
                  setShowCreateModalOverlay(true);
                }}>
                  <UploadCloudIcon />
                  {
                    currentPage === "LedgerCollection" ?
                      <>Create New Ledger</> :
                      currentPage === "BankStatements" ?
                        <>Create New Statement Group</> :
                        currentPage === "Reconciliations" ?
                          <>Create New Reconciliation Group</> :
                          null
                  }
                </Link>
              </div>
          }


        </header>

        <div className="page-body">
          <Outlet context={{showCreateModalOverlay, setShowCreateModalOverlay}} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
