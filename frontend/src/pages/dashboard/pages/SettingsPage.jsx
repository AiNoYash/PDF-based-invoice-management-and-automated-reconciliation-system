import React, { useState } from 'react';
import './SettingsPage.css';
import useAuthStore from "./../../../store/useAuthStore";

export function SettingsPage() {

    // const [username, setUsername] = useState('Yash');
    const user = useAuthStore(state => state.user);
    const setLastActiveBusinessId = useAuthStore(state => state.setLastActiveBusinessId);
    const username = user.username;

    const [newUsername, setNewUsername] = useState('');

    const [businesses, setBusinesses] = useState([
        { id: 1, business_name: 'Yash Tech' }
    ]);

    const [newBusinessName, setNewBusinessName] = useState('');
    const [selectedBusinessId, setSelectedBusinessId] = useState(user?.lastActiveBusinessId || 1);

    const [bankAccounts, setBankAccounts] = useState([
        { id: 1, business_id: 1, bank_name: 'HDFC', account_nickname: 'Main Operations', account_last_four: '1234' }
    ]);
    const [newBankDetails, setNewBankDetails] = useState({ bank_name: '', account_nickname: '', account_last_four: '' });

    // --- Handlers ---
    const handleUpdateUsername = () => {
        // if (newUsername) setUsername(newUsername);
        setNewUsername('');
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure you want to permanently delete your account?")) {
            console.log("Account deleted");
        }
    };

    const handleAddBusiness = () => {
        if (!newBusinessName) return;
        const newBiz = { id: Date.now(), business_name: newBusinessName };
        setBusinesses([...businesses, newBiz]);
        if (!selectedBusinessId) {
            setSelectedBusinessId(newBiz.id);
            setLastActiveBusinessId(newBiz.id, newBiz.business_name);
        }
        setNewBusinessName('');
    };

    const handleDeleteBusiness = (id) => {
        if (window.confirm("Are you sure? This will delete the business and all linked bank accounts.")) {
            // API call to delete business
            const updatedBusinesses = businesses.filter(biz => biz.id !== id);
            setBusinesses(updatedBusinesses);

            // If the deleted business was the active one, fallback to another or null
            if (selectedBusinessId === id) {
                const nextActiveBusiness = updatedBusinesses.length > 0 ? updatedBusinesses[0] : null;
                const nextActiveBusinessId = nextActiveBusiness ? nextActiveBusiness.id : null;
                setSelectedBusinessId(nextActiveBusinessId);
                setLastActiveBusinessId(nextActiveBusinessId, nextActiveBusiness ? nextActiveBusiness.business_name : null);
            }

            // Simulating DB CASCADE DELETE
            setBankAccounts(bankAccounts.filter(acc => acc.business_id !== id));
        }
    };

    const handleAddBankAccount = () => {
        if (!newBankDetails.bank_name || !selectedBusinessId) return;
        setBankAccounts([...bankAccounts, { id: Date.now(), business_id: selectedBusinessId, ...newBankDetails }]);
        setNewBankDetails({ bank_name: '', account_nickname: '', account_last_four: '' });
    };

    const handleDeleteBankAccount = (id) => {
        setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
    };

    const handleActiveBusinessChange = (e) => {
        const businessId = Number(e.target.value);
        const selectedBusiness = businesses.find((biz) => biz.id === businessId);
        setSelectedBusinessId(businessId);
        setLastActiveBusinessId(businessId, selectedBusiness ? selectedBusiness.business_name : null);
    };

    // --- Derived Data ---
    const activeBusinessBankAccounts = bankAccounts.filter(acc => acc.business_id === selectedBusinessId);

    return (
        <div className="settings-container">
            {/* 1. Account Settings */}
            <section className="settings-section">
                <h3>Account Settings</h3>
                <div className="form-group">
                    <label>Current Username: {username}</label>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="New Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
                        <button onClick={handleUpdateUsername} className="btn-primary">Update</button>
                    </div>
                </div>
                <div className="form-group danger-zone">
                    <button onClick={handleDeleteAccount} className="btn-danger">Delete Account</button>
                </div>
            </section>

            {/* 2. Business Management */}
            <section className="settings-section">
                <h3>Manage Businesses</h3>

                {/* Active Business Selector */}
                <div className="business-selector" style={{ marginBottom: '1.5rem' }}>
                    <label><strong>Select Active Business (Site-Wide):</strong></label>
                    {businesses.length === 0 ? (
                        <p style={{ color: 'red', marginTop: '0.5rem' }}>No businesses found. Please add one below.</p>
                    ) : (
                        <select 
                            value={selectedBusinessId || ''} 
                            onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
                        >
                            {businesses.map(biz => (
                                <option key={biz.id} value={biz.id}>{biz.business_name}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Business List */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label><strong>Your Businesses:</strong></label>
                    <ul className="settings-list" style={{ marginTop: '0.5rem' }}>
                        {businesses.map(biz => (
                            <li key={biz.id} className="settings-list-item">
                                <span>
                                    {biz.business_name}
                                    {selectedBusinessId === biz.id && <span className="badge-active">Active</span>}
                                </span>
                                <button onClick={() => handleDeleteBusiness(biz.id)} className="btn-danger-small">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add Business Form */}
                <div className="add-form-container">
                    <h4>Add New Business</h4>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="New Business Name"
                            value={newBusinessName}
                            onChange={(e) => setNewBusinessName(e.target.value)}
                        />
                        <button onClick={handleAddBusiness} className="btn-primary">Add</button>
                    </div>
                </div>
            </section>

            {/* 3. Bank Account Management */}
            <section className="settings-section">
                <h3>Bank Accounts</h3>
                {!selectedBusinessId ? (
                    <p style={{ color: 'red' }}>Please create and select a business to manage its bank accounts.</p>
                ) : (
                    <>
                        <p>Managing accounts for the currently active business.</p>

                        <ul className="settings-list" style={{ marginBottom: '1.5rem' }}>
                            {activeBusinessBankAccounts.map(acc => (
                                <li key={acc.id} className="settings-list-item">
                                    <span>{acc.bank_name} - {acc.account_nickname} (**** **** **** {acc.account_last_four})</span>
                                    <button onClick={() => handleDeleteBankAccount(acc.id)} className="btn-danger-small">Remove</button>
                                </li>
                            ))}
                        </ul>

                        <div className="add-form-container">
                            <h4>Add New Bank Account</h4>
                            <div className="input-group multi-input">
                                <input
                                    type="text"
                                    placeholder="Bank Name (e.g. HDFC)"
                                    value={newBankDetails.bank_name}
                                    onChange={(e) => setNewBankDetails({ ...newBankDetails, bank_name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Nickname"
                                    value={newBankDetails.account_nickname}
                                    onChange={(e) => setNewBankDetails({ ...newBankDetails, account_nickname: e.target.value })}
                                />
                                <input
                                    type="text"
                                    maxLength="4"
                                    placeholder="Last 4 Digits"
                                    value={newBankDetails.account_last_four}
                                    onChange={(e) => setNewBankDetails({ ...newBankDetails, account_last_four: e.target.value })}
                                />
                                <button onClick={handleAddBankAccount} className="btn-primary">Add</button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}