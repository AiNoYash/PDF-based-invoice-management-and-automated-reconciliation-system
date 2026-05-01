import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../../../store/useAuthStore";
import "./LedgerDetails.css";

const initialMockTransactions = {
    1: [
        { id: 't1', transactionId: 'TXN-001', reconciled: 'Yes', date: '2026-04-10', debit: '1500.00', credit: '', description: 'Client Payment - Acme Corp', fileName: 'inv-acme-01.pdf' },
        { id: 't2', transactionId: 'TXN-002', reconciled: 'No', date: '2026-04-11', debit: '', credit: '250.00', description: 'Office Supplies', fileName: 'receipt-staples.pdf' },
    ],
    2: [
        { id: 't3', transactionId: 'TXN-003', reconciled: 'Yes', date: '2026-03-15', debit: '5000.00', credit: '', description: 'Q1 Ad Spend Allocation', fileName: null },
    ],
    3: []
};


export function LedgerDetails() {
    const { id } = useParams();
    const [transactions, setTransactions] = useState(initialMockTransactions[id] || []);
    const token = useAuthStore((state) => state.token);
    const fileInputRef = useRef(null);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const API = "http://localhost:8085/api/v1";

    const handleTransactionUpdate = (id, field, value) => {
        setTransactions(prev => prev.map(txn =>
            txn.id === id ? { ...txn, [field]: value } : txn
        ));
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now().toString(),
            transactionId: '',
            reconciled: 'No',
            date: '',
            debit: '',
            credit: '',
            description: '',
            fileName: ''
        };
        setTransactions([...transactions, newRow]);
    };

    const closeAddEntryModal = () => {
        setShowAddEntryModal(false);
        setFiles([]);
        setError("");
        setUploading(false);
    };

    const handleManualEntry = () => {
        handleAddRow();
        closeAddEntryModal();
    };

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || []);
        setFiles((prev) => {
            const existing = prev.map((file) => file.name);
            const freshFiles = selected.filter((file) => !existing.includes(file.name));
            return [...prev, ...freshFiles];
        });
        e.target.value = "";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files || []);
        setFiles((prev) => {
            const existing = prev.map((file) => file.name);
            const freshFiles = droppedFiles.filter((file) => !existing.includes(file.name));
            return [...prev, ...freshFiles];
        });
    };

    const handleDragOver = (e) => e.preventDefault();

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    };

    const handleUploadInvoices = async () => {
        if (files.length === 0) {
            setError("Please select at least one invoice file.");
            return;
        }

        if (!token) {
            setError("Authentication token missing. Please login again.");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formPayload = new FormData();
            files.forEach((file) => formPayload.append("files", file));

            const response = await fetch(`${API}/ledger/${id}/files`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formPayload
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to upload invoices");
            }

            const generatedRows = files.map((file, index) => ({
                id: `${Date.now()}-${index}`,
                transactionId: '',
                reconciled: 'No',
                date: '',
                debit: '',
                credit: '',
                description: '',
                fileName: file.name
            }));
            setTransactions((prev) => [...prev, ...generatedRows]);
            closeAddEntryModal();
        } catch (uploadError) {
            setError(uploadError.message || "Could not upload invoices.");
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (name) => {
        const extension = name.split(".").pop()?.toLowerCase();
        if (extension === "pdf") return "📄";
        if (["xls", "xlsx"].includes(extension)) return "📊";
        if (extension === "csv") return "📋";
        return "📁";
    };


    return (
        <>
            <div className="transactions-view">
                <div className="ledger-table-container">
                    <table className="ledger-table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Transaction ID</th>
                                <th style={{ width: '120px' }}>Reconciled</th>
                                <th style={{ width: '150px' }}>Date</th>
                                <th style={{ width: '120px' }}>Debit</th>
                                <th style={{ width: '120px' }}>Credit</th>
                                <th>Description</th>
                                <th>File Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={txn.id}>
                                    <td>{index + 1}</td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            defaultValue={txn.transactionId}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'transactionId', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <select
                                            className="editable-input"
                                            defaultValue={txn.reconciled}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'reconciled', e.target.value)}
                                        >
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="date"
                                            defaultValue={txn.date}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'date', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="number"
                                            placeholder="0.00"
                                            defaultValue={txn.debit}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'debit', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="number"
                                            placeholder="0.00"
                                            defaultValue={txn.credit}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'credit', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            placeholder="Enter description..."
                                            defaultValue={txn.description}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'description', e.target.value)}
                                        />
                                    </td>
                                    <td className="editable-cell">
                                        <input
                                            className="editable-input"
                                            type="text"
                                            placeholder="Optional file..."
                                            defaultValue={txn.fileName || ''}
                                            onBlur={(e) => handleTransactionUpdate(txn.id, 'fileName', e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button className="add-row-btn" onClick={() => setShowAddEntryModal(true)}>
                    {/* <Plus size={18} />  */}
                    Add New Entry
                </button>
            </div>

            {showAddEntryModal && (
                <div className="entry-modal-overlay" onClick={closeAddEntryModal}>
                    <div className="entry-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="entry-modal-header">
                            <h2>Add New Entry</h2>
                            <button
                                type="button"
                                className="entry-btn-close"
                                onClick={closeAddEntryModal}
                                disabled={uploading}
                            >
                                &times;
                            </button>
                        </div>

                        {error && (
                            <div className="entry-modal-error">
                                <span>{error}</span>
                                <button type="button" onClick={() => setError("")}>✕</button>
                            </div>
                        )}

                        <div className="entry-option-grid">
                            <button
                                type="button"
                                className="entry-option-card"
                                onClick={handleManualEntry}
                                disabled={uploading}
                            >
                                <h3>Manual Entry</h3>
                                <p>Add a blank row and fill details manually.</p>
                            </button>
                        </div>

                        <div className="entry-form-group">
                            <label>Upload Invoice <span className="entry-label-optional">(PDF, Excel, CSV)</span></label>
                            <div
                                className={`entry-file-dropzone ${uploading ? "entry-dropzone-disabled" : ""}`}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept=".pdf,.csv,.xls,.xlsx"
                                    onChange={handleFileChange}
                                    className="entry-file-input-hidden"
                                    disabled={uploading}
                                />
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="entry-upload-icon"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <p>Click to browse or drag files here</p>
                                <span className="entry-file-count">
                                    {files.length > 0 ? `${files.length} file(s) selected` : "No files selected"}
                                </span>
                            </div>

                            {files.length > 0 && (
                                <ul className="entry-file-list">
                                    {files.map((file, index) => (
                                        <li key={`${file.name}-${index}`} className="entry-file-list-item">
                                            <span className="entry-file-icon">{getFileIcon(file.name)}</span>
                                            <span className="entry-file-name" title={file.name}>{file.name}</span>
                                            <button
                                                type="button"
                                                className="entry-file-remove-btn"
                                                onClick={() => removeFile(index)}
                                                disabled={uploading}
                                            >
                                                ✕
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="entry-modal-actions">
                            <button
                                type="button"
                                className="entry-btn-cancel"
                                onClick={closeAddEntryModal}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="entry-btn-submit"
                                onClick={handleUploadInvoices}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload Invoice"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}