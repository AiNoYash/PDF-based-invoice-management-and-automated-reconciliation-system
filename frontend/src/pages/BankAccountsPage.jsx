import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function BankAccountsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [bankName, setBankName] = useState('');
  const [nickname, setNickname] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [businessId, setBusinessId] = useState('');
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

  const submit = (event) => {
    event.preventDefault();
    setMessage(`Captured details for ${bankName} (${nickname || 'No nickname'}) ending ${lastFour || '----'}.`);
    setBankName('');
    setNickname('');
    setLastFour('');
  };

  return (
    <section className="page-card">
      <h2 className="page-title">Bank Account Details</h2>
      <p className="page-subtitle">Schema fields: `business_id`, `bank_name`, `account_nickname`, `account_last_four`.</p>
      <form onSubmit={submit} className="form-grid">
        <div className="form-field">
          <label>Business *</label>
          <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} required>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.business_name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Bank Name *</label>
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="HDFC / SBI / ICICI" required />
        </div>
        <div className="form-field">
          <label>Account Nickname</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Operations Account" />
        </div>
        <div className="form-field">
          <label>Last 4 Digits</label>
          <input value={lastFour} onChange={(e) => setLastFour(e.target.value)} maxLength={4} />
        </div>
        <div className="form-field">
          <label>Action</label>
          <button className="primary-btn" type="submit">Save Bank Account</button>
        </div>
      </form>
      {message ? <p className="page-subtitle">{message}</p> : null}
    </section>
  );
}

export default BankAccountsPage;
