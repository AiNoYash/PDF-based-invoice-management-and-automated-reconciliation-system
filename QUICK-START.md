## 🚀 Quick Start - CSV Bank Statement Upload

### ⚡ 30 Second Setup

1. **Backend** (in root directory)
   ```bash
   npm start
   ```
   
2. **Frontend** (in new terminal, in frontend directory)
   ```bash
   npm run dev
   ```

3. **Access**: Open `http://localhost:5173` in browser

---

### 📋 Upload a Bank Statement - 2 Minutes

1. **Login** to your account
2. Navigate to **Bank Statements** in sidebar
3. Click **"Create New Statement Group"** button
4. Fill the form:
   ```
   Group Name: "April Bank Statement"
   Month: April
   Year: 2026
   Bank Account: Select from dropdown
   ```
5. **Click "Choose File"** → Select `sample-bank-statement.csv` (included in project)
6. Click **"Create Group"**
7. ✅ **Done!** Statement uploaded and parsed

---

### 👀 View Parsed Data - 1 Minute

1. Your new statement appears in the list
2. **Click on it** to view all 10 transactions
3. See:
   - Transaction IDs
   - Dates
   - Amounts (colored: 🔴 red for debit, 🟢 green for credit)
   - Descriptions
   - Reconciliation status

---

### 📊 Supported CSV Format Example

```csv
Transaction ID,Date,Debit,Credit,Description,Type
TXN-001,2026-04-01,1500.00,,Client Payment,debit
TXN-002,2026-04-02,,500.00,Office Supplies,credit
```

Or this format:
```csv
ID,Date,Amount,Description
TX-100,2026-04-01,1500.00,Client Payment
TX-101,2026-04-02,-500.00,Office Supplies
```

The parser **automatically detects columns** - use any combination of:
- `transaction id`, `tx id`, or `id`
- `date`, `transaction date`, or `posted date`
- `amount`, `debit`, or `credit`
- `description`, `details`, or `narration`

---

### 🎯 What Happens Behind the Scenes

```
CSV Upload
    ↓
PapaParse reads file
    ↓
Column names auto-detected
    ↓
Data extracted & normalized
    ↓
Database saved
    ↓
List updates automatically
    ↓
You can view details
```

---

### ✅ Checklist Before First Use

- [ ] Backend running (`npm start`)
- [ ] Frontend running (`npm run dev`)
- [ ] MySQL database connected
- [ ] You're logged in
- [ ] Bank account exists in settings
- [ ] You have a CSV file (or use sample-bank-statement.csv)

---

### ❓ Common Questions

**Q: Do I need Python?**
No! Everything is JavaScript/Node.js. PapaParse handles CSV parsing.

**Q: Where are files stored?**
CSV files saved to `/uploads/bank_statements/`
Transaction records saved in MySQL database

**Q: Can I use my own CSV?**
Yes! As long as it has columns like: date, amount, description
The parser auto-detects most column names.

**Q: How many transactions can I upload?**
No limit! Parser handles 1000+ records efficiently.

**Q: Can I edit transactions after upload?**
Yes! Click on a statement and toggle reconciliation status for each record.

---

### 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "File upload failed" | Check .csv extension, try sample file |
| "No data showing" | Refresh page, check browser console for errors |
| "Can't find bank account" | Create one in Settings first |
| "Backend not responding" | Make sure `npm start` is running |
| "Database error" | Verify MySQL is running and connected |

---

### 📚 Full Documentation

For detailed information, see:
- `CSV-BANK-STATEMENT-GUIDE.md` - Complete API & format guide
- `IMPLEMENTATION-SUMMARY.md` - Technical overview
- `SETUP-VERIFICATION.md` - Complete checklist

---

### 🎉 You're All Set!

Your CSV bank statement parser is ready to use. 

Start by uploading the included `sample-bank-statement.csv` and explore the features!

---

**Questions?** Check the documentation files or the code comments in:
- `controller/bankStatementController.js` - Backend logic
- `frontend/src/pages/dashboard/pages/BankStatementsPage.jsx` - Frontend list
- `frontend/src/pages/dashboard/pages/components/CreateBankStatementGroupModal.jsx` - Upload component
