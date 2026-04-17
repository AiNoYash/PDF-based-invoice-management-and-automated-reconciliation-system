const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../config/db');

const uploadsRoot = path.join(__dirname, '..', 'uploads');
const invoicesDir = path.join(uploadsRoot, 'invoices');
const statementsDir = path.join(uploadsRoot, 'statements');

[uploadsRoot, invoicesDir, statementsDir].forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'invoice') {
            cb(null, invoicesDir);
            return;
        }
        cb(null, statementsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({ storage });

const ensureBusinessBelongsToUser = async (businessId, userId) => {
    const [rows] = await db.execute(
        'SELECT id FROM businesses WHERE id = ? AND user_id = ?',
        [businessId, userId]
    );
    return rows.length > 0;
};

const listBusinesses = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                b.id,
                b.business_name,
                b.created_at,
                COUNT(DISTINCT v.id) AS vendors,
                COUNT(DISTINCT i.id) AS invoices,
                SUM(CASE WHEN i.status = 'PAID' THEN 1 ELSE 0 END) AS cleared,
                SUM(CASE WHEN i.status = 'PARTIALLY_PAID' THEN 1 ELSE 0 END) AS partial,
                SUM(CASE WHEN i.status = 'UNPAID' THEN 1 ELSE 0 END) AS pending
             FROM businesses b
             LEFT JOIN vendors v ON v.business_id = b.id
             LEFT JOIN invoices i ON i.business_id = b.id
             WHERE b.user_id = ?
             GROUP BY b.id
             ORDER BY b.created_at DESC`,
            [req.user.userId]
        );

        const businesses = rows.map((item) => ({
            ...item,
            vendors: Number(item.vendors || 0),
            invoices: Number(item.invoices || 0),
            cleared: Number(item.cleared || 0),
            partial: Number(item.partial || 0),
            pending: Number(item.pending || 0),
            risk: item.invoices ? Math.round((Number(item.pending || 0) / Number(item.invoices)) * 100) : 0
        }));

        res.status(200).json({ businesses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch businesses' });
    }
};

const createBusiness = async (req, res) => {
    try {
        const { business_name } = req.body;
        if (!business_name) {
            return res.status(400).json({ message: 'business_name is required' });
        }

        const [result] = await db.execute(
            'INSERT INTO businesses (user_id, business_name) VALUES (?, ?)',
            [req.user.userId, business_name]
        );

        res.status(201).json({
            business: {
                id: result.insertId,
                business_name,
                vendors: 0,
                invoices: 0,
                cleared: 0,
                partial: 0,
                pending: 0,
                risk: 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create business' });
    }
};

const listVendors = async (req, res) => {
    try {
        const businessId = Number(req.query.business_id);
        if (!businessId) {
            return res.status(400).json({ message: 'business_id is required' });
        }

        const canAccess = await ensureBusinessBelongsToUser(businessId, req.user.userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Business access denied' });
        }

        const [vendors] = await db.execute(
            'SELECT id, vendor_name, business_id, created_at FROM vendors WHERE business_id = ? ORDER BY created_at DESC',
            [businessId]
        );
        res.status(200).json({ vendors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch vendors' });
    }
};

const createVendor = async (req, res) => {
    try {
        const { vendor_name, business_id } = req.body;
        const businessId = Number(business_id);
        if (!vendor_name || !businessId) {
            return res.status(400).json({ message: 'vendor_name and business_id are required' });
        }

        const canAccess = await ensureBusinessBelongsToUser(businessId, req.user.userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Business access denied' });
        }

        const [result] = await db.execute(
            'INSERT INTO vendors (vendor_name, business_id) VALUES (?, ?)',
            [vendor_name, businessId]
        );

        res.status(201).json({
            vendor: {
                id: result.insertId,
                vendor_name,
                business_id: businessId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create vendor' });
    }
};

const uploadInvoice = async (req, res) => {
    try {
        const businessId = Number(req.body.business_id);
        const totalAmount = Number(req.body.total_amount || 0);

        if (!businessId || !req.file) {
            return res.status(400).json({ message: 'business_id and invoice file are required' });
        }

        const canAccess = await ensureBusinessBelongsToUser(businessId, req.user.userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Business access denied' });
        }

        const invoiceNumber = req.body.invoice_number || path.parse(req.file.originalname).name.slice(0, 100);
        const invoiceDate = req.body.invoice_date || null;
        const filePath = path.relative(path.join(__dirname, '..'), req.file.path);

        const [result] = await db.execute(
            `INSERT INTO invoices (business_id, vendor_id, invoice_number, invoice_date, total_amount, status, file_path, file_type)
             VALUES (?, ?, ?, ?, ?, 'UNPAID', ?, ?)`,
            [businessId, req.body.vendor_id || null, invoiceNumber, invoiceDate, totalAmount, filePath, req.file.mimetype || 'application/pdf']
        );

        res.status(201).json({
            message: 'Invoice uploaded successfully',
            invoice: { id: result.insertId, invoice_number: invoiceNumber, file_path: filePath }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload invoice' });
    }
};

const ensureDefaultBankAccount = async (businessId) => {
    const [accounts] = await db.execute(
        'SELECT id FROM bank_accounts WHERE business_id = ? ORDER BY id ASC LIMIT 1',
        [businessId]
    );
    if (accounts.length) {
        return accounts[0].id;
    }

    const [insertResult] = await db.execute(
        'INSERT INTO bank_accounts (business_id, bank_name, account_nickname, account_last_four) VALUES (?, ?, ?, ?)',
        [businessId, 'Default Bank', 'Primary', '0000']
    );
    return insertResult.insertId;
};

const uploadStatement = async (req, res) => {
    try {
        const businessId = Number(req.body.business_id);
        if (!businessId || !req.file) {
            return res.status(400).json({ message: 'business_id and statement file are required' });
        }

        const canAccess = await ensureBusinessBelongsToUser(businessId, req.user.userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Business access denied' });
        }

        const bankAccountId = req.body.bank_account_id ? Number(req.body.bank_account_id) : await ensureDefaultBankAccount(businessId);
        const filePath = path.relative(path.join(__dirname, '..'), req.file.path);

        const [result] = await db.execute(
            'INSERT INTO statement_uploads (business_id, bank_account_id, file_path) VALUES (?, ?, ?)',
            [businessId, bankAccountId, filePath]
        );

        res.status(201).json({
            message: 'Statement uploaded successfully',
            statement: { id: result.insertId, file_path: filePath, bank_account_id: bankAccountId }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to upload statement' });
    }
};

const listReconciliation = async (req, res) => {
    try {
        const businessId = Number(req.query.business_id);
        if (!businessId) {
            return res.status(400).json({ message: 'business_id is required' });
        }

        const canAccess = await ensureBusinessBelongsToUser(businessId, req.user.userId);
        if (!canAccess) {
            return res.status(403).json({ message: 'Business access denied' });
        }

        const [rows] = await db.execute(
            `SELECT
                i.id,
                i.invoice_number AS invoice,
                COALESCE(v.vendor_name, 'Unknown Vendor') AS vendor,
                i.total_amount AS amount,
                i.status,
                CASE
                    WHEN i.status = 'PAID' THEN 'AUTO_EXACT'
                    WHEN i.status = 'PARTIALLY_PAID' THEN 'AUTO_PARTIAL'
                    ELSE 'MANUAL_REVIEW'
                END AS type
             FROM invoices i
             LEFT JOIN vendors v ON v.id = i.vendor_id
             WHERE i.business_id = ?
             ORDER BY i.created_at DESC
             LIMIT 100`,
            [businessId]
        );

        const activity = rows.map((row) => ({
            ...row,
            status: row.status === 'PAID' ? 'MATCHED' : row.status === 'PARTIALLY_PAID' ? 'PARTIALLY_MATCHED' : 'UNMATCHED'
        }));

        res.status(200).json({ activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch reconciliation data' });
    }
};

module.exports = {
    upload,
    listBusinesses,
    createBusiness,
    listVendors,
    createVendor,
    uploadInvoice,
    uploadStatement,
    listReconciliation
};
