# CSV Bank Statement Upload & Parsing Guide

## Overview
This feature enables users to upload CSV files containing bank statement data. The system uses PapaParse for client-side parsing and Node.js/Express with multer for server-side file handling. All parsed data is stored in the database for easy access and reconciliation.

## Features
✅ **PapaParse CSV Parsing** - Flexible column detection and data normalization
✅ **Server-side File Storage** - CSV files saved to `/uploads/bank_statements/`
✅ **Intelligent Data Extraction** - Supports multiple column naming conventions
✅ **Database Persistence** - All records stored in `bank_statement_records` table
✅ **Transaction Type Detection** - Automatically identifies debit/credit transactions
✅ **Reconciliation Ready** - Reconciliation status tracked per record

## Architecture

### Backend Components
1. **bankStatementController.js**
   - `uploadStatementGroup()` - Handles CSV upload and parsing
   - `getStatementGroups()` - Fetches all statement groups
   - `getStatementGroupById()` - Fetches records for a specific group

2. **bankStatementRoute.js**
   - Multer configuration for file uploads
   - Endpoint: `POST /api/v1/bank-statement/upload`
   - Requires: CSV file + metadata (name, month, year, bankAccountId)

3. **Database Schema**
   - `bank_statement_groups` - Groups of statements
   - `bank_statement_files` - Uploaded file references
   - `bank_statement_records` - Individual transaction records

### Frontend Components
1. **CreateBankStatementGroupModal.jsx**
   - File upload UI
   - Form validation
   - API submission with FormData

2. **BankStatementsPage.jsx**
   - Lists all statement groups
   - Real-time data fetching from API
   - Empty state and error handling

3. **StatementGroupDetails.jsx**
   - Displays parsed transactions
   - Shows amounts, dates, and descriptions
   - Reconciliation toggle per record

## Supported CSV Formats

The parser automatically detects and normalizes these column names:

### Transaction ID
- `transaction id`, `tx id`, `id`, `reference`, `transaction reference`, `transaction ref`

### Date
- `date`, `transaction date`, `posted date`, `value date`

### Amount (with fallback detection)
- `amount`, `transaction amount`, `amt`, `value`
- Fallback: `debit` or `credit` if amount not found

### Transaction Type
- `type`, `transaction type`, `txn type`
- Auto-detected if: debit/credit columns present or negative amounts

### Description
- `description`, `details`, `narration`, `transaction description`, `text`

## Example CSV Format
```csv
Transaction ID,Date,Debit,Credit,Description,Type
TXN-001,2026-04-01,1500.00,,Client Payment - ABC Corp,debit
TXN-002,2026-04-02,,500.00,Office Supplies,credit
TXN-003,2026-04-03,2500.00,,Quarterly Revenue,debit
```

Alternative Format:
```csv
ID,Transaction Date,Amount,Description
TX-100,2026-04-01,1500.00,Client Payment
TX-101,2026-04-02,-500.00,Office Supplies
```

## API Endpoints

### Upload Bank Statement
**POST** `/api/v1/bank-statement/upload`

Request:
```javascript
const formData = new FormData();
formData.append('name', 'April Bank Statement');
formData.append('month', 4);
formData.append('year', 2026);
formData.append('bankAccountId', 1);
formData.append('statementCsv', csvFile);

axios.post('/api/v1/bank-statement/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});
```

Response:
```json
{
  "message": "Bank statement CSV uploaded, stored, and parsed successfully.",
  "bankStatementGroup": {
    "id": 1,
    "name": "April Bank Statement",
    "bankAccountId": 1,
    "month": 4,
    "year": 2026,
    "entries": 10,
    "createdAt": "2026-05-01T10:00:00Z"
  },
  "parsedRecordsCount": 10
}
```

### Get All Statement Groups
**GET** `/api/v1/bank-statement/groups`

Response:
```json
{
  "groups": [
    {
      "id": 1,
      "name": "April Bank Statement",
      "month": 4,
      "year": 2026,
      "entries": 10,
      "bankAccount": "Chase Business (•••• 4219)",
      "createdAt": "2026-05-01T10:00:00Z"
    }
  ]
}
```

### Get Statement Details
**GET** `/api/v1/bank-statement/groups/:id`

Response:
```json
{
  "group": {
    "id": 1,
    "name": "April Bank Statement",
    "month": 4,
    "year": 2026,
    "bankAccount": "Chase Business (•••• 4219)",
    "createdAt": "2026-05-01T10:00:00Z"
  },
  "records": [
    {
      "id": 1,
      "transactionId": "TXN-001",
      "reconciled": "No",
      "date": "2026-04-01",
      "amount": "1500.00",
      "type": "debit",
      "description": "Client Payment - ABC Corp"
    }
  ]
}
```

## Data Processing Flow

1. **Upload** - User selects CSV file in modal
2. **Validation** - File type checked (must be .csv)
3. **Parse** - PapaParse converts CSV to JSON
4. **Normalize** - Column names normalized to lowercase
5. **Extract** - Data extracted using flexible key matching
6. **Store** - Records saved to database
7. **Display** - Data fetched and displayed in UI

## Testing

### Test CSV File
A sample CSV file is included: `sample-bank-statement.csv`

### Manual Testing Steps
1. Start backend: `npm start` (in root directory)
2. Start frontend: `npm run dev` (in frontend directory)
3. Navigate to Bank Statements section
4. Click "Create New Statement Group"
5. Fill in form:
   - Group Name: "April Test"
   - Month: April
   - Year: 2026
   - Bank Account: Select from list
6. Select `sample-bank-statement.csv` and submit
7. Verify data appears in the list and details view

## Error Handling

### Common Issues
1. **"Only CSV files are allowed"**
   - Solution: Ensure file has .csv extension and MIME type is text/csv

2. **"No bank statement group found"**
   - Solution: Verify bank account exists and group ID is correct

3. **CSV parse error**
   - Solution: Check CSV format matches supported column names

4. **File upload fails**
   - Solution: Check multer upload folder exists at `/uploads/bank_statements/`

## Dependencies
- **Backend**: papaparse ^5.4.1, multer ^2.1.1, express ^5.2.1
- **Frontend**: papaparse ^5.4.1, axios ^1.15.2, react-router-dom ^7.14.1

## File Structure
```
├── controller/
│   └── bankStatementController.js       # CSV parsing logic
├── routes/
│   └── bankStatementRoute.js            # Upload endpoint & multer config
├── config/
│   └── schema.sql                       # Database tables
├── uploads/
│   └── bank_statements/                 # CSV storage directory
├── frontend/src/pages/dashboard/pages/
│   ├── BankStatementsPage.jsx           # Main list view
│   └── components/
│       ├── CreateBankStatementGroupModal.jsx
│       └── StatementGroupDetails.jsx    # Record details
```

## Future Enhancements
- Batch upload multiple CSV files
- Custom column mapping UI
- Data validation rules
- Duplicate transaction detection
- Automatic reconciliation suggestions
- Export reconciled statements to PDF
