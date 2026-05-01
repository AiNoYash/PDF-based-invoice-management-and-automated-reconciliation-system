import React, { useState } from 'react';
import './CreateReconciliationModel.css';

const mockLedgers = [
  { id: 'ledger_1', name: 'Main Operating Ledger' },
  { id: 'ledger_2', name: 'Tax Ledger' }
];

const mockStatementGroups = [
  { id: 'group_1', name: 'Q1 2024 Statements' },
  { id: 'group_2', name: 'Q2 2024 Statements' }
];

export function CreateReconcilationsModel({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    ledgerId: '',
    statementGroupId: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Object:", formData);
    onClose(); 
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Select Ledger and Group</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Select Ledger</label>
            <select
              className="form-select"
              required
              value={formData.ledgerId}
              onChange={(e) => setFormData({ ...formData, ledgerId: e.target.value })}
            >
              <option value="" disabled>Select a ledger...</option>
              {mockLedgers.map(ledger => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Statement Group</label>
            <select
              className="form-select"
              required
              value={formData.statementGroupId}
              onChange={(e) => setFormData({ ...formData, statementGroupId: e.target.value })}
            >
              <option value="" disabled>Select a statement group...</option>
              {mockStatementGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Confirm</button>
          </div>

        </form>
      </div>
    </div>
  );
}