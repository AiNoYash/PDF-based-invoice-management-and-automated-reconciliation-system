import React, { useEffect, useMemo, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function Dashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const totals = useMemo(() => businesses.reduce(
    (acc, b) => ({
      invoices: acc.invoices + Number(b.invoices || 0),
      cleared: acc.cleared + Number(b.cleared || 0),
      partial: acc.partial + Number(b.partial || 0),
      pending: acc.pending + Number(b.pending || 0),
      vendors: acc.vendors + Number(b.vendors || 0)
    }),
    { invoices: 0, cleared: 0, partial: 0, pending: 0, vendors: 0 }
  ), [businesses]);
  const clearanceRate = totals.invoices ? Math.round((totals.cleared / totals.invoices) * 100) : 0;
  const pendingRate = totals.invoices ? Math.round((totals.pending / totals.invoices) * 100) : 0;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/businesses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load dashboard data');
        setBusinesses(data.businesses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <>
      <section className="page-card">
        <h2 className="page-title">Platform Overview</h2>
        <p className="page-subtitle">Track reconciliation progress across all registered businesses.</p>
        <div className="metrics-grid">
          <div className="metric metric-interactive"><h4>Businesses</h4><p>{businesses.length}</p></div>
          <div className="metric metric-interactive"><h4>Vendors</h4><p>{totals.vendors}</p></div>
          <div className="metric metric-interactive"><h4>Total Invoices</h4><p>{totals.invoices}</p></div>
          <div className="metric metric-interactive"><h4>Cleared</h4><p>{totals.cleared}</p></div>
          <div className="metric metric-interactive"><h4>Partially Paid</h4><p>{totals.partial}</p></div>
          <div className="metric metric-interactive"><h4>Pending</h4><p>{totals.pending}</p></div>
        </div>
        <div className="overview-progress-row">
          <div className="overview-progress-card progress-card-interactive">
            <div className="overview-progress-head">
              <h4>Overall Clearance</h4>
              <span>{clearanceRate}%</span>
            </div>
            <div className="overview-progress-track">
              <div className="overview-progress-fill fill-clearance" style={{ width: `${clearanceRate}%` }} />
            </div>
          </div>
          <div className="overview-progress-card progress-card-interactive">
            <div className="overview-progress-head">
              <h4>Pending Exposure</h4>
              <span>{pendingRate}%</span>
            </div>
            <div className="overview-progress-track">
              <div className="overview-progress-fill fill-pending" style={{ width: `${pendingRate}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="page-card">
        <h3 className="page-title">Business Snapshot</h3>
        {loading ? <p>Loading...</p> : null}
        {error ? <p>{error}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Business</th>
                <th>Vendors</th>
                <th>Invoices</th>
                <th>Cleared</th>
                <th>Partial</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id} className="dashboard-row-hover">
                  <td>{business.business_name}</td>
                  <td>{business.vendors}</td>
                  <td>{business.invoices}</td>
                  <td>{business.cleared}</td>
                  <td>{business.partial}</td>
                  <td>{business.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
