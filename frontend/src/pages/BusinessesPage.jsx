import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function BusinessesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchBusinesses = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/businesses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch businesses');
    setBusinesses(data.businesses || []);
  };

  useEffect(() => {
    fetchBusinesses().catch((err) => setMessage(err.message));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createBusiness = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ business_name: businessName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create business');
      setBusinessName('');
      setMessage('Business created');
      await fetchBusinesses();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <section className="page-card">
        <h2 className="page-title">Business Registration</h2>
        <p className="page-subtitle">Schema field: `businesses.business_name` linked to logged-in `user_id`.</p>
        <form onSubmit={createBusiness} className="form-grid">
          <div className="form-field">
            <label>Business Name *</label>
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Action</label>
            <button className="primary-btn" type="submit">Create Business</button>
          </div>
        </form>
        {message ? <p className="page-subtitle">{message}</p> : null}
      </section>

      <section className="page-card">
        <h3 className="page-title">Registered Businesses</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Business Name</th>
                <th>Vendors</th>
                <th>Invoices</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id}>
                  <td>{business.id}</td>
                  <td>{business.business_name}</td>
                  <td>{business.vendors}</td>
                  <td>{business.invoices}</td>
                  <td>{new Date(business.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default BusinessesPage;
