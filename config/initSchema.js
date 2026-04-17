const db = require('./db');

const hasColumn = async (tableName, columnName) => {
    const [rows] = await db.execute(
        `SELECT COUNT(*) AS count
         FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
        [tableName, columnName]
    );
    return Number(rows[0].count) > 0;
};

const initSchema = async () => {
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    if (!(await hasColumn('users', 'password_hash'))) {
        await db.execute('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)');
    }
    if (!(await hasColumn('users', 'created_at'))) {
        await db.execute('ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    }
    if (await hasColumn('users', 'password')) {
        await db.execute('UPDATE users SET password_hash = password WHERE password_hash IS NULL');
        await db.execute('ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL');
    }
    if (await hasColumn('users', 'username')) {
        await db.execute('ALTER TABLE users MODIFY COLUMN username VARCHAR(100) NULL');
    }
    if (await hasColumn('users', 'phone')) {
        await db.execute('ALTER TABLE users MODIFY COLUMN phone VARCHAR(30) NULL');
    }

    await db.execute(`
        CREATE TABLE IF NOT EXISTS businesses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            business_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS vendors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendor_name VARCHAR(255) NOT NULL,
            business_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            business_id INT NOT NULL,
            vendor_id INT,
            invoice_number VARCHAR(100),
            invoice_date DATE,
            total_amount DECIMAL(15, 2) NOT NULL,
            status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID') DEFAULT 'UNPAID',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            file_path VARCHAR(555) NOT NULL,
            file_type VARCHAR(50) DEFAULT 'application/pdf',
            FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
            FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS bank_accounts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            business_id INT NOT NULL,
            bank_name VARCHAR(100) NOT NULL,
            account_nickname VARCHAR(255),
            account_last_four VARCHAR(4),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS statement_uploads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            business_id INT NOT NULL,
            bank_account_id INT NOT NULL,
            file_path VARCHAR(555) NOT NULL,
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
            FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS bank_transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            business_id INT NOT NULL,
            bank_account_id INT NOT NULL,
            bank_reference_number VARCHAR(100),
            transaction_date DATE NOT NULL,
            description VARCHAR(500) NOT NULL,
            amount DECIMAL(15, 2) NOT NULL,
            transaction_type ENUM('DEBIT', 'CREDIT') NOT NULL,
            status ENUM('UNMATCHED', 'PARTIALLY_MATCHED', 'MATCHED') DEFAULT 'UNMATCHED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            statement_id INT,
            FOREIGN KEY (statement_id) REFERENCES statement_uploads(id) ON DELETE SET NULL,
            FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
            FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE,
            UNIQUE KEY uniq_bank_transaction (bank_account_id, bank_reference_number, transaction_date, amount, description)
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS reconciliation_matches (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_id INT NOT NULL,
            transaction_id INT NOT NULL,
            matched_amount DECIMAL(15, 2) NOT NULL,
            match_type ENUM('AUTO_EXACT', 'AUTO_PARTIAL', 'MANUAL_OVERRIDE') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
            FOREIGN KEY (transaction_id) REFERENCES bank_transactions(id) ON DELETE CASCADE
        )
    `);
};

module.exports = initSchema;
