const db = require('../config/db');

class LedgerModel {
    // Get all ledgers for a business with bank account details and file counts as "entries"
    static async findByBusinessId(businessId) {
        const [rows] = await db.execute(
            `SELECT
                l.id,
                l.target_month,
                l.target_year,
                l.created_at,
                ba.bank_name,
                ba.account_nickname,
                ba.account_last_four,
                COUNT(lf.id) AS entries
            FROM ledgers l
            JOIN bank_accounts ba ON l.bank_account_id = ba.id
            LEFT JOIN ledger_files lf ON l.id = lf.ledger_id
            WHERE ba.business_id = ?
            GROUP BY l.id, l.target_month, l.target_year, l.created_at,
                     ba.bank_name, ba.account_nickname, ba.account_last_four
            ORDER BY l.created_at DESC`,
            [businessId]
        );
        return rows;
    }

    // Create a new ledger
    static async create(bankAccountId, targetMonth, targetYear) {
        const [result] = await db.execute(
            'INSERT INTO ledgers (bank_account_id, target_month, target_year) VALUES (?, ?, ?)',
            [bankAccountId, targetMonth, targetYear]
        );
        return result.insertId;
    }

    // Get a single ledger by ID with related data
    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT
                l.id,
                l.target_month,
                l.target_year,
                l.created_at,
                ba.bank_name,
                ba.account_nickname,
                ba.account_last_four,
                COUNT(lf.id) AS entries
            FROM ledgers l
            JOIN bank_accounts ba ON l.bank_account_id = ba.id
            LEFT JOIN ledger_files lf ON l.id = lf.ledger_id
            WHERE l.id = ?
            GROUP BY l.id`,
            [id]
        );
        return rows[0] || null;
    }

    // Delete a ledger (with business ownership check)
    static async delete(id, businessId) {
        const [result] = await db.execute(
            `DELETE l FROM ledgers l
             JOIN bank_accounts ba ON l.bank_account_id = ba.id
             WHERE l.id = ? AND ba.business_id = ?`,
            [id, businessId]
        );
        return result.affectedRows;
    }

    // Store uploaded file record in ledger_files
    static async addFile(ledgerId, filePath, fileType) {
        const [result] = await db.execute(
            'INSERT INTO ledger_files (ledger_id, file_path, file_type) VALUES (?, ?, ?)',
            [ledgerId, filePath, fileType]
        );
        return result.insertId;
    }

    // Get all files for a ledger
    static async getFiles(ledgerId) {
        const [rows] = await db.execute(
            'SELECT * FROM ledger_files WHERE ledger_id = ? ORDER BY created_at DESC',
            [ledgerId]
        );
        return rows;
    }
}

module.exports = LedgerModel;
