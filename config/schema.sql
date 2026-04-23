CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    bank_name VARCHAR(100) NOT NULL, 
    account_nickname VARCHAR(255), 
    account_last_four VARCHAR(4),  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledgers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_month INT NOT NULL,
    target_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledger_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ledger_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type ENUM('excel_ledger', 'invoice_pdf') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ledger_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ledger_id INT NOT NULL,
    ledger_file_id INT DEFAULT NULL,
    transaction_id VARCHAR(255),
    index_number INT,
    is_reconciled BOOLEAN DEFAULT FALSE,
    transaction_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type ENUM('debit', 'credit') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ledger_file_id) REFERENCES ledger_files(id) ON DELETE SET NULL,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS bank_statement_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_month INT NOT NULL,
    target_year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS bank_statement_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_statement_group_id INT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_statement_group_id) REFERENCES bank_statement_groups(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS bank_statement_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_statement_group_id INT NOT NULL,
    bank_statement_file_id INT DEFAULT NULL,
    transaction_id VARCHAR(255), 
    index_number INT,
    is_reconciled BOOLEAN DEFAULT FALSE, 
    transaction_date DATE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL, 
    transaction_type ENUM('debit', 'credit') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bank_statement_group_id) REFERENCES bank_statement_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_statement_file_id) REFERENCES bank_statement_files(id) ON DELETE SET NULL
);


CREATE TABLE IF NOT EXISTS reconciliation_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ledger_id INT NOT NULL, 
    bank_statement_group_id INT NOT NULL,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (ledger_id) REFERENCES ledgers(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_statement_group_id) REFERENCES bank_statement_groups(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reconciliation_id INT NOT NULL,
    ledger_record_id INT DEFAULT NULL, 
    bank_statement_record_id INT DEFAULT NULL, 
    match_type ENUM('auto_exact', 'auto_partial', 'manual') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reconciliation_id) REFERENCES reconciliation_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (ledger_record_id) REFERENCES ledger_records(id) ON DELETE SET NULL,
    FOREIGN KEY (bank_statement_record_id) REFERENCES bank_statement_records(id) ON DELETE SET NULL
);

ALTER TABLE users 
ADD COLUMN last_active_business_id INT,
ADD FOREIGN KEY (last_active_business_id) REFERENCES businesses(id) ON DELETE SET NULL;

-- ? Need to run above lines only once PLEASE   