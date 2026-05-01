const LedgerModel = require('../model/ledgerModel');
const { parsePdf } = require('../parsing/parser');

const uploadInvoice = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const ledger_id = req.body.ledger_id;
        if (!ledger_id) {
            return res.status(400).json({ message: "ledger_id is required" });
        }

        const filePath = req.file.path;

        // 1. Save file record to ledger_files
        const ledger_file_id = await LedgerModel.addFile(ledger_id, filePath, 'invoice_pdf');

        // 2. Parse the PDF — returns an array of invoice data (one per page)
        const invoiceRecords = await parsePdf(filePath);

        // 3. Insert all parsed records into ledger_records
        const insertedIds = await LedgerModel.addRecords(ledger_id, ledger_file_id, invoiceRecords);

        res.status(200).json({
            message: `PDF uploaded and parsed successfully! ${insertedIds.length} record(s) created.`,
            fileName: req.file.filename,
            records: invoiceRecords,
            recordIds: insertedIds
        });
    } catch (error) {
        console.error("Upload/Parse error:", error);
        res.status(500).json({ message: "Server error during PDF processing" });
    }
};

module.exports = {
    uploadInvoice
};
