import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function ReconciliationPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState('');
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const init = async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/businesses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch businesses');
      setBusinesses(data.businesses || []);
      if (data.businesses?.length) setBusinessId(String(data.businesses[0].id));
    };
    init().catch((err) => setMessage(err.message));
  }, [token]);

  useEffect(() => {
    if (!businessId) return;
    const load = async () => {
      setMessage('');
      const response = await fetch(`${API_BASE_URL}/api/v1/reconciliation?business_id=${businessId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Failed to fetch reconciliation');
        return;
      }
      setRows(data.activity || []);
    };
    load();
  }, [businessId, token]);

  const badgeClass = (status) => {
    if (status === 'MATCHED') return 'status-chip chip-ok';
    if (status === 'PARTIALLY_MATCHED') return 'status-chip chip-warn';
    return 'status-chip chip-alert';
  };

  return (
    <>
      <section className="page-card">
        <h2 className="page-title">Reconciliation Result</h2>
        <p className="page-subtitle">Shows invoice payment status and matching type from schema workflow.</p>
        <div className="form-grid">
          <div className="form-field">
            <label>Business</label>
            <select value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>{business.business_name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="page-card">
        <h3 className="page-title">Invoice Matching Feed</h3>
        {message ? <p className="page-subtitle">{message}</p> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Match Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.invoice || '-'}</td>
                  <td>{row.vendor}</td>
                  <td>INR {Number(row.amount || 0).toLocaleString('en-IN')}</td>
                  <td>{row.type}</td>
                  <td><span className={badgeClass(row.status)}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default ReconciliationPage;
