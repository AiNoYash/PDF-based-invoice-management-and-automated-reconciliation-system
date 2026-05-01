import React, { useState, useEffect } from 'react';
import './CreateReconciliationModel.css';
import axios from 'axios';
import useAuthStore from '../../../../store/useAuthStore';

export function CreateReconcilationsModel({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    ledgerId: '',
    statementGroupId: ''
  });

  const [ledgers, setLedgers] = useState([]);
  const [statementGroups, setStatementGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [ledgersRes, statementsRes] = await Promise.all([
        axios.get('http://localhost:8085/api/v1/ledger', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8085/api/v1/bank-statement/groups', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setLedgers(ledgersRes.data.data || []);
      setStatementGroups(statementsRes.data.groups || []);

    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError('Failed to load ledgers or statement groups.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Object:", formData);
    onClose();
  };

  const handleLedgerChange = (e) => {
    const newLedgerId = e.target.value;
    const selectedL = ledgers.find(l => l.id.toString() === newLedgerId);

    let matchingGroupId = '';

    if (selectedL) {
      const matchingGroup = statementGroups.find(group =>
        String(group.bankAccountId) === String(selectedL.bankAccountId) &&
        String(group.month) === String(selectedL.targetMonth) &&
        String(group.year) === String(selectedL.targetYear)
      );

      if (matchingGroup) {
        matchingGroupId = matchingGroup.id.toString();
      }
    }

    setFormData({
      ...formData,
      ledgerId: newLedgerId,
      statementGroupId: matchingGroupId
    });
  };

  const selectedLedger = ledgers.find(l => l.id.toString() === formData.ledgerId);

  const filteredStatementGroups = selectedLedger
    ? statementGroups.filter(group =>
      String(group.bankAccountId) === String(selectedLedger.bankAccountId) &&
      String(group.month) === String(selectedLedger.targetMonth) &&
      String(group.year) === String(selectedLedger.targetYear)
    )
    : statementGroups;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>Select Ledger and Group</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div className="form-group">
            <label>Select Ledger</label>
            <select
              className="form-select"
              required
              value={formData.ledgerId}
              onChange={handleLedgerChange}
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? 'Loading...' : 'Select a ledger...'}
              </option>
              {ledgers.map(ledger => (
                <option key={ledger.id} value={ledger.id}>
                  {ledger.bankAccount} - {ledger.month} {ledger.year}
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
              disabled={loading || !formData.ledgerId}
            >
              <option value="" disabled>
                {loading ? 'Loading...' : !formData.ledgerId ? 'Select a ledger first...' : 'Select a statement group...'}
              </option>
              {filteredStatementGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-submit" disabled={loading}>Confirm</button>
          </div>

        </form>
      </div>
    </div>
  );
}