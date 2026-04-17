import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function StatementsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState('');
  const [statementFile, setStatementFile] = useState(null);
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

  const uploadStatement = async (event) => {
    event.preventDefault();
    if (!statementFile) {
      setMessage('Please select a CSV statement file.');
      return;
    }
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('business_id', businessId);
      formData.append('statement', statementFile);
      const response = await fetch(`${API_BASE_URL}/api/v1/statements/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload statement');
      setStatementFile(null);
      setMessage(`Statement uploaded with id ${data.statement?.id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="page-card">
      <h2 className="page-title">Bank Statement Upload</h2>
      <p className="page-subtitle">Schema fields: `statement_uploads.business_id`, `bank_account_id`, `file_path`, `upload_date`.</p>
      <form onSubmit={uploadStatement} className="form-grid">
        <div className="form-field">
          <label>Business *</label>
          <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} required>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.business_name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>CSV File *</label>
          <input type="file" accept=".csv" onChange={(e) => setStatementFile(e.target.files?.[0] || null)} required />
        </div>
        <div className="form-field">
          <label>Action</label>
          <button className="primary-btn" type="submit">Upload Statement</button>
        </div>
      </form>
      {message ? <p className="page-subtitle">{message}</p> : null}
    </section>
  );
}

export default StatementsPage;
