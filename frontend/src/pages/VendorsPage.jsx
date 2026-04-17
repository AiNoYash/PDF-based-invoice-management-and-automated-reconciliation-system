import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function VendorsPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState('');
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState('');
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
    const loadVendors = async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/vendors?business_id=${businessId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch vendors');
      setVendors(data.vendors || []);
    };
    loadVendors().catch((err) => setMessage(err.message));
  }, [businessId, token]);

  const createVendor = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/vendors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vendor_name: vendorName, business_id: Number(businessId) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create vendor');
      setVendorName('');
      setVendors((prev) => [data.vendor, ...prev]);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <section className="page-card">
        <h2 className="page-title">Vendor Management</h2>
        <p className="page-subtitle">Schema fields: `vendors.vendor_name`, `vendors.business_id`.</p>
        <form onSubmit={createVendor} className="form-grid">
          <div className="form-field">
            <label>Business *</label>
            <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} required>
              {businesses.map((business) => (
                <option key={business.id} value={business.id}>{business.business_name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Vendor Name *</label>
            <input value={vendorName} onChange={(e) => setVendorName(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Action</label>
            <button className="primary-btn" type="submit">Add Vendor</button>
          </div>
        </form>
        {message ? <p className="page-subtitle">{message}</p> : null}
      </section>

      <section className="page-card">
        <h3 className="page-title">Vendors in Selected Business</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendor Name</th>
                <th>Business ID</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.id}</td>
                  <td>{vendor.vendor_name}</td>
                  <td>{vendor.business_id}</td>
                  <td>{new Date(vendor.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default VendorsPage;
