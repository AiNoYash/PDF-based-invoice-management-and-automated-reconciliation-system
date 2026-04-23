import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Dashboard.css';

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
);



function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar />





      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h2>Overview</h2>
          </div>
          <div className="topbar-right">
            <Link to="/#upload" className="btn-upload-primary">
              <UploadCloudIcon /> Upload PDF / CSV
            </Link>
          </div>
        </header>

        <div className="page-body">
          <div className="welcome-banner">
            <h1>Welcome back, John!</h1>
            <p>Here is your financial reconciliation status for Acme Corp.</p>
          </div>

          {/* Core Metrics */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-card-title">Total Invoices</div>
              <div className="stat-card-value">1,250</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Bank Transactions</div>
              <div className="stat-card-value">2,840</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Matched Invoices</div>
              <div className="stat-card-value text-matched">1,135</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-title">Pending Exceptions</div>
              <div className="stat-card-value text-pending">12</div>
            </div>
          </div>

          {/* Dashboard Two Column Grid */}
          <div className="dashboard-grid">

            {/* Left Column: Quick Upload Zone */}
            <div className="upload-panel">
              <h3>Quick Upload</h3>

              <div className="upload-box">
                <UploadCloudIcon />
                <p>Upload PDF Invoice</p>
                <span>Extract vendor & amounts instantly.</span>
              </div>

              <div className="upload-box" style={{ marginBottom: 0 }}>
                <UploadCloudIcon />
                <p>Upload Bank CSV</p>
                <span>HDFC, SBI, or ICICI statement.</span>
              </div>
            </div>

            {/* Right Column: Recent Activity / Feed */}
            <div className="activity-panel">
              <div className="panel-header">
                <h3>Recent Reconciliation Activity</h3>
                <Link to="/#all" className="view-all">View All</Link>
              </div>

              <div className="activity-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction Info</th>
                      <th>Ref/Invoice</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="activity-desc">Credit: Tech Solutions Ltd</div>
                        <div className="activity-date">Today, 10:45 AM</div>
                      </td>
                      <td>INV-2024000</td>
                      <td><strong>$4,250.00</strong></td>
                      <td><span className="status-badge status-matched">Matched</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="activity-desc">Credit: Office Supplies Co</div>
                        <div className="activity-date">Today, 09:12 AM</div>
                      </td>
                      <td>INV-2024001</td>
                      <td><strong>$892.50</strong></td>
                      <td><span className="status-badge status-matched">Matched</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="activity-desc">Credit: Cloud Services Inc</div>
                        <div className="activity-date">Yesterday, 4:00 PM</div>
                      </td>
                      <td>INV-2024002</td>
                      <td><strong>$1,500.00</strong></td>
                      <td><span className="status-badge status-partial">Partial Match</span></td>
                    </tr>
                    <tr>
                      <td>
                        <div className="activity-desc">Credit: Unknown Wire</div>
                        <div className="activity-date">Yesterday, 1:30 PM</div>
                      </td>
                      <td>--</td>
                      <td><strong>$65.00</strong></td>
                      <td><span className="status-badge status-unmatched">Unmatched</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
