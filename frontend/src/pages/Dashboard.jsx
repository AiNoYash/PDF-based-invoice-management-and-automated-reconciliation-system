import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

// SVG Icons
const BarChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);

const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);

const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);


function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <BarChartIcon />
          </div>
          ReconFlow
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item active">
            <HomeIcon /> Dashboard
          </Link>
          <Link to="/#upload" className="nav-item">
            <UploadCloudIcon /> Upload Center
          </Link>
          <Link to="/#invoices" className="nav-item">
            <FileTextIcon /> Invoices
          </Link>
          <Link to="/#statements" className="nav-item">
            <CreditCardIcon /> Bank Statements
          </Link>
          <Link to="/#settings" className="nav-item">
            <SettingsIcon /> Settings
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">JS</div>
            <div className="user-info">
              <h4>J. Smith (Admin)</h4>
              <p>Acme Corp Ltd.</p>
            </div>
          </div>
        </div>
      </aside>

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
