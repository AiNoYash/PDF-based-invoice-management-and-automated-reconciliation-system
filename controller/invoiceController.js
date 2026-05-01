const fs = require('fs');
const pdfParse = require('pdf-parse');
const db = require('../config/db');
const { getClassifier } = require('../classifier');

const uploadInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const ledger_id = req.body.ledger_id || 1; // Assuming passed in body, default to 1 if testing

        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        const pdfParse = getPdfParser();
        const data = await pdfParse(dataBuffer);
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
