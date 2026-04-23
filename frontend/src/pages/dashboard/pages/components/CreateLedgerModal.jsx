import React, { useState } from 'react';
import './CreateLedgerModal.css';

const mockBankAccounts = [
  { id: 'bank_1', name: 'HDFC Current', lastFour: '1234' },
  { id: 'bank_2', name: 'SBI Savings', lastFour: '5678' }
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);


// ! For the backend person please remember you have to make stuff like mockBankAccounts and stuff at a layer above or store them in zustand store
export  function CreateLedgerModal({ isOpen, onClose }) {

  const [formData, setFormData] = useState({
    name: '',
    month: months[new Date().getMonth()],
    year: currentYear,
    bankAccountId: ''
  });
  
  const [files, setFiles] = useState([]); // ? This will have all the files

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    // Convert FileList to Array and keep existing files if appending
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Ledger:", formData);
    console.log("Attached Files:", files);
    onClose(); // Close modal after mock submit
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Create New Ledger</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Ledger Name</label>
            <input
              type="text"
              required
              placeholder="e.g., April Sales Invoices"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Month</label>
              <select
                className="form-select"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="form-group flex-1">
              <label>Year</label>
              <select
                className="form-select"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Linked Bank Account</label>
            <select
              className="form-select"
              required
              value={formData.bankAccountId}
              onChange={(e) => setFormData({ ...formData, bankAccountId: e.target.value })}
            >
              <option value="" disabled>Select an account...</option>
              {mockBankAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (•••• {acc.lastFour})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Upload Files (Text-PDFs or Excel)</label>
            <div className="file-dropzone">
              <input
                type="file"
                id="ledger-files"
                multiple
                accept=".pdf,.csv,.xls,.xlsx"
                onChange={handleFileChange}
                className="file-input-hidden"
              />
              <label htmlFor="ledger-files" className="file-dropzone-label">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p>Click to browse or drag files here</p>
                <span className="file-count">
                  {files.length > 0 ? `${files.length} file(s) selected` : 'No files selected'}
                </span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Create Ledger</button>
          </div>

        </form>
      </div>
    </div>
  );
}