const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('../config/db');
const { PDFParse } = require('pdf-parse');



// Basic regex based parser
const parseInvoiceText = (text) => {

    
    let transaction_id = null;
    let transaction_date = null;
    let amount = null;
    let description = "Invoice";

    // Simple extraction logic - adjust regex as needed for actual formats

    // Look for Invoice Number (e.g. INV-1020, Invoice: 12345)
    const invRegex = /Invoice(?:\s*No\.?|\s*Number|\s*\#)?\s*:?\s*([A-Za-z0-9\-]+)/i;
    const invMatch = text.match(invRegex);
    if (invMatch) transaction_id = invMatch[1];

    // Look for Date (e.g. Date: 12/04/2026, 2026-04-12)
    const dateRegex = /Date\s*:?\s*(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,4})/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
        // Will need proper formatting to YYYY-MM-DD for mysql, assuming YYYY-MM-DD or simple valid date
        transaction_date = new Date(dateMatch[1]).toISOString().split('T')[0];
    } else {
        transaction_date = new Date().toISOString().split('T')[0]; // fallback
    }

    // Look for Total Amount (e.g. Total: $120.50, Amount Due: 500)
    const amountRegex = /(?:Total|Amount Due|Balance Due)\s*:?\s*(?:Rs\.?|\$|₹|INR)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i;
    const amountMatch = text.match(amountRegex);
    if (amountMatch) {
        amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    // Determine Debit or Credit based on 'Bill To' or 'Bill From'
    // If it says 'Bill From', it usually means we received the invoice (Expense -> Debit)
    // If we only see 'Bill To' but not 'Bill From', it might be our invoice (Revenue -> Credit)
    // Or we can just look for the literal strings:
    let transaction_type = 'debit'; // default
    const textUpper = text.toUpperCase();
    if (textUpper.includes('BILL FROM') || textUpper.includes('INVOICE FROM')) {
        transaction_type = 'debit'; // We are being billed, so we pay (Debit)
    } else if (textUpper.includes('BILL TO') || textUpper.includes('INVOICE TO')) {
        transaction_type = 'credit'; // We are billing someone, so we receive (Credit)
    }

    return { transaction_id, transaction_date, amount, description, transaction_type };
};

const uploadInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const ledger_id = req.body.ledger_id || 1; // Assuming passed in body, default to 1 if testing

        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        const pdfParse = new PDFParse({ dataBuffer });
        const data = await pdfParse.getText();
        const text = data.text;

        const parsedData = parseInvoiceText(text);

        // Save file record to ledger_files
        const [fileResult] = await db.execute(
            'INSERT INTO ledger_files (ledger_id, file_path, file_type) VALUES (?, ?, ?)',
            [ledger_id, filePath, 'invoice_pdf']
        );
        const ledger_file_id = fileResult.insertId;

        // Save parsed data to ledger_records
        const [recordResult] = await db.execute(
            'INSERT INTO ledger_records (ledger_id, ledger_file_id, transaction_id, transaction_date, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ledger_id, ledger_file_id, parsedData.transaction_id, parsedData.transaction_date, parsedData.amount || 0.00, parsedData.transaction_type, parsedData.description]
        );

        res.status(200).json({
            message: "PDF uploaded and parsed successfully!",
            fileName: req.file.filename,
            parsedData,
            recordId: recordResult.insertId
        });
    } catch (error) {
        console.error("Upload/Parse error:", error);

        if (String(error?.message || '').includes('DOMMatrix is not defined')) {
            return res.status(500).json({
                message: "PDF parsing failed because runtime does not support required DOM APIs. Use Node.js 20 LTS or a pdf parser version compatible with your Node runtime."
            });
        }

        res.status(500).json({ message: "Server error during PDF processing" });
    }
};

module.exports = {
    uploadInvoice
};
