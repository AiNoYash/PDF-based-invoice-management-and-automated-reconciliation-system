import React, { useEffect, useState } from 'react';
import './Workspace.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';

function InvoicesPage() {
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [file, setFile] = useState(null);
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

  const uploadInvoice = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a PDF file.');
      return;
    }
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('business_id', businessId);
      formData.append('invoice_number', invoiceNumber);
      formData.append('invoice_date', invoiceDate);
      formData.append('total_amount', totalAmount || '0');
      formData.append('invoice', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/invoices/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload invoice');
      setMessage(`Uploaded invoice ${data.invoice?.invoice_number || ''}`);
      setInvoiceNumber('');
      setInvoiceDate('');
      setTotalAmount('');
      setFile(null);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <section className="page-card">
      <h2 className="page-title">Invoice Upload</h2>
      <p className="page-subtitle">Schema fields: `invoice_number`, `invoice_date`, `total_amount`, `file_path`, `file_type`, `business_id`.</p>
      <form onSubmit={uploadInvoice} className="form-grid">
        <div className="form-field">
          <label>Business *</label>
          <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} required>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.business_name}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Invoice Number</label>
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Invoice Date</label>
          <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Total Amount *</label>
          <input type="number" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Invoice PDF *</label>
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        </div>
        <div className="form-field">
          <label>Action</label>
          <button className="primary-btn" type="submit">Upload Invoice</button>
        </div>
      </form>
      {message ? <p className="page-subtitle">{message}</p> : null}
    </section>
  );
}

export default InvoicesPage;
