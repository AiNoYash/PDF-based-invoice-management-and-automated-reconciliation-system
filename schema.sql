-- 1. Users Table (The Account Owner)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Businesses Table (The SME sending the invoices)
CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Vendor Table 
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    -- ! Making array of normalized name
    -- ! Making separate list vendor tables for each businesses
		business_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);


-- 4. Invoices Table 
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    vendor_id INT,
    invoice_number VARCHAR(100),
    invoice_date DATE,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('UNPAID', 'PARTIALLY_PAID', 'PAID') DEFAULT 'UNPAID', -- Changed status names to reflect getting paid
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_path VARCHAR(555) NOT NULL,
		-- file path is now name and returning created at time and file name
		file_type VARCHAR(50) DEFAULT 'application/pdf',
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);


-- This tracks the different bank accounts the SME owns.
CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    bank_name VARCHAR(100) NOT NULL, -- e.g., 'HDFC', 'ICICI', 'SBI'
    account_nickname VARCHAR(255), -- User-defined name to differentiate identical accounts
    account_last_four VARCHAR(4),    -- e.g., '9876' (Helps the user identify the account)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS statement_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,
    bank_account_id INT NOT NULL,
    file_path VARCHAR(555) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE
);

-- UPDATED TABLE: Bank Transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Internal system ID
    business_id INT NOT NULL,
    bank_account_id INT NOT NULL,      -- Tells us WHICH bank account this CSV belongs to
    
    -- THE NEW CRITICAL FIELD:
    bank_reference_number VARCHAR(100), -- The UTR, UPI Ref, or Cheque Number from the CSV
    
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
    UNIQUE (bank_account_id, bank_reference_number, transaction_date, amount, description) -- This is so that if user uploads same csv then we don't get duplucate records
		-- If a bank_reference_number exists, it's usually enough on its own. However, since some CSVs might have null references for small bank charges, keep your group but make sure the logic handles NULL properly (in MySQL, NULL values are not considered equal in unique constraints).
);

-- (reconciliation_matches table remains exactly the same)

-- 6. Reconciliation Matches Table (Linking the payment to the invoice)
CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    transaction_id INT NOT NULL,
    matched_amount DECIMAL(15, 2) NOT NULL, 
    match_type ENUM('AUTO_EXACT', 'AUTO_PARTIAL', 'MANUAL_OVERRIDE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (transaction_id) REFERENCES bank_transactions(id) ON DELETE CASCADE
);
