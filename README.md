# PDF-Based Invoice Management And Automated Reconciliation System

## Overview

This project automates invoice processing and financial reconciliation for SMEs using text-based PDF invoices and bank statements in CSV format.

Main flow:

1. Upload text-based invoice PDF.
2. Extract invoice fields using PDF text extraction and parsing logic.
3. Upload bank statement CSV.
4. Run reconciliation using amount/date/vendor similarity scoring.
5. View dashboard summary for matched, partial, and unmatched records.


## Tech Stack

- Backend: Node.js + Express
- Database: MySQL
- PDF extraction: pdf-parse
- CSV parsing: csv-parse
- Auth: JWT

## Current Features

- User registration and login
- MySQL schema bootstrap on app startup
- Invoice upload API (PDF)
- Bank statement upload API (CSV)
- Reconciliation engine with configurable tolerance
- Dashboard summary and latest reconciliation results
- Audit logs for core actions

## Database Entities

- users
- invoices
- bank_transactions
- reconciliation_results
- audit_logs

## Setup

1. Install dependencies:

	 npm install

2. Configure environment variables in .env:

	 PORT=8080
	 JWT_SECRET=your_secret
	 MYSQL_HOST=localhost
	 MYSQL_PORT=3306
	 MYSQL_USER=root
	 MYSQL_PASSWORD=your_password
	 MYSQL_DATABASE=invoice_management

3. Start the server:

	 node server.js

## API Endpoints

Base URL: /api/v1/reconciliation

- POST /upload-invoice
	- Auth: required (Bearer token)
	- Form-data field: invoice (PDF file)

- POST /upload-bank-statement
	- Auth: required (Bearer token)
	- Form-data field: statement (CSV file)

- POST /run
	- Auth: required (Bearer token)
	- Optional JSON body:
		- amountToleranceAbs
		- amountTolerancePercent
		- dateToleranceDays

- GET /dashboard
	- Auth: required (Bearer token)
	- Returns summary counts and recent reconciliation records

## Notes

- This version is optimized for text-based PDFs and intentionally does not use OCR.
- OCR/image-based invoice support can be added as an extension.
