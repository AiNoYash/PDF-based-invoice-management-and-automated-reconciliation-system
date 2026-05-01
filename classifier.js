const natural = require('natural');
const path = require('path');
const fs = require('fs');

const MODEL_FILE = path.join(__dirname, 'invoice_classifier.json');

// Top-level singleton
let classifierInstance = null;

function getClassifier() {
    return new Promise((resolve, reject) => {
        if (classifierInstance) {
            return resolve(classifierInstance);
        }

        // 2. If it's not in memory, check if the file exists on disk
        if (fs.existsSync(MODEL_FILE)) {
            natural.BayesClassifier.load(MODEL_FILE, null, (err, loadedClassifier) => {
                if (err) return reject(err);

                classifierInstance = loadedClassifier;
                resolve(classifierInstance);
            });
        } else {
            // 3. If no file exists, create a fresh one
            classifierInstance = new natural.BayesClassifier();
            resolve(classifierInstance);
        }
    });
}


function saveClassifier() {
    if (!classifierInstance) return;

    classifierInstance.save(MODEL_FILE, (err) => {
        if (err) console.error("Failed to save model:", err);
        else console.log("Model saved to disk.");
    });
}

const trainingData = [
    {
        label: 'transaction_id_anchor',
        phrases: [
            // --- Existing ---
            'Invoice Number', 'Invoice Number:', 'Invoice No.', 'Invoice No:',
            'Invoice #', 'Inv Number', 'Inv No', 'Inv#',
            'Transaction ID', 'Transaction ID:', 'Txn ID', 'Txn #',
            'Transaction No', 'Transaction Number',
            'Receipt Number', 'Receipt No:', 'Receipt #',
            'Bill Number', 'Bill No:', 'Bill #',
            'Reference Number', 'Ref Number', 'Ref No:', 'Ref ID',
            'Order Number', 'Order No:', 'Order ID',
            'P.O. Number', 'PO Number', 'PO#', 'Purchase Order',
            'Document No:', 'Payment ID', 'Payment Reference', 'Confirmation Number',
            'Invoice ID', 'Invoice Reference', 'Invoice Ref',
            'Bill ID', 'Bill Ref',
            'Document Number', 'Document ID',
            'Voucher Number', 'Voucher No', 'Voucher ID',
            'UTR Number', 'UTR No', 'UTR', 'RRN',
            'Reference ID', 'Txn Ref No', 'Transaction Ref',
            'Payment Ref No', 'Payment Ref',
            'Bank Reference', 'Transfer ID', 'Transfer Reference',
            'Order Reference', 'Order Ref No',
            'Shipment ID', 'Tracking Number',
            'Booking ID', 'Booking Reference',
            'Receipt ID', 'Record Number', 'Serial Number',
            'Confirmation ID', 'Authorization Code', 'Approval Code',

            // --- Invoice / Bill Variants ---
            'Invoice Num', 'Inv Num', 'Inv. No.', 'Inv. Number',
            'Invoice No #', 'Invoice Ref No', 'Invoice Ref ID',
            'Tax Invoice No', 'Tax Invoice Number', 'Tax Invoice #',
            'Proforma Invoice No', 'Proforma No', 'Pro Forma Invoice No',
            'Credit Note No', 'Credit Note Number', 'Credit Note #', 'CN No', 'CN#',
            'Debit Note No', 'Debit Note Number', 'Debit Note #', 'DN No', 'DN#',
            'Bill of Supply No', 'Bill of Supply Number',
            'Challan No', 'Challan Number', 'Challan #',
            'Delivery Challan No', 'DC No', 'DC Number',
            'Quotation No', 'Quotation Number', 'Quote No', 'Quote #', 'QT No',
            'Estimate No', 'Estimate Number', 'Est. No',
            'Work Order No', 'Work Order Number', 'WO No', 'WO#',
            'Sales Order No', 'Sales Order Number', 'SO No', 'SO#',
            'Purchase Order No', 'Purchase Order Number', 'PO No',
            'Delivery Order No', 'DO No', 'DO#',

            // --- Document / Record Variants ---
            'Document Ref', 'Document Reference', 'Doc No', 'Doc ID', 'Doc Ref',
            'Doc. No.', 'Doc. Number', 'Doc. Ref.',
            'Form No', 'Form Number', 'Form ID',
            'Voucher Ref', 'Voucher Ref No', 'JV No', 'Journal Voucher No',
            'Payment Voucher No', 'Receipt Voucher No', 'Contra Voucher No',
            'Entry No', 'Entry Number', 'Entry ID',
            'Slip No', 'Slip Number', 'Slip ID',
            'Ticket No', 'Ticket Number', 'Ticket ID', 'Ticket #',
            'Case No', 'Case Number', 'Case ID',
            'Policy No', 'Policy Number', 'Policy ID',
            'Claim No', 'Claim Number', 'Claim ID', 'Claim #',
            'Contract No', 'Contract Number', 'Contract ID', 'Contract Ref',
            'Agreement No', 'Agreement Number', 'Agreement ID',
            'GRN No', 'GRN Number', 'Goods Receipt No', 'Goods Receipt Number',
            'MRN No', 'Material Receipt No',

            // --- Banking / Finance ---
            'Cheque No', 'Cheque Number', 'Cheque #', 'Check No', 'Check Number',
            'DD No', 'Demand Draft No', 'DD Number', 'Demand Draft Number',
            'Account Number', 'Account No', 'A/C No', 'Acct No',
            'Folio No', 'Folio Number',
            'Loan Account No', 'Loan No', 'Loan Reference No',
            'Credit Card No', 'Card No', 'Card Number', 'Last 4 Digits',
            'Bank Reference No', 'Bank Ref No', 'Bank Txn ID',
            'NEFT Ref No', 'NEFT Reference', 'IMPS Ref No', 'RTGS Ref No',
            'SWIFT Ref No', 'SWIFT Reference',
            'ACH Trace No', 'Wire Transfer No',
            'Mandate Reference No', 'NACH Mandate No',
            'ECS Reference No',
            'Statement No', 'Statement Number',
            'Passbook No', 'Passbook Number',
            'Challan ID', 'BHIM Reference',
            'UPI Transaction ID', 'UPI Ref No', 'UPI Reference No',
            'Google Pay Transaction ID', 'PhonePe Transaction ID', 'Paytm Order ID',

            // --- E-Commerce / Logistics ---
            'Order Ref', 'Order #', 'Order Code',
            'Tracking ID', 'Tracking No', 'Track ID',
            'AWB No', 'AWB Number', 'Airway Bill No',
            'Consignment No', 'Consignment Number',
            'Shipment No', 'Shipment Number', 'Shipment Ref',
            'Parcel ID', 'Parcel No', 'Package ID',
            'Delivery ID', 'Dispatch No', 'Dispatch ID',
            'Return Order No', 'Return ID', 'RMA No', 'RMA Number',
            'Cart ID', 'Cart No',
            'Session ID', 'Transaction Session ID',
            'Merchant Order ID', 'Merchant Txn ID', 'Merchant Reference',
            'Gateway Transaction ID', 'Gateway Ref No',
            'Payment Gateway ID', 'PG Transaction ID',
            'Razorpay Order ID', 'Razorpay Payment ID',
            'Cashfree Order ID', 'PayU Transaction ID',

            // --- Travel / Hospitality ---
            'Booking No', 'Booking #', 'Reservation No', 'Reservation ID',
            'Reservation Number', 'Booking Ref', 'Booking Ref No',
            'PNR No', 'PNR Number', 'PNR',
            'Ticket Number', 'Ticket No', 'E-Ticket No',
            'Seat No', 'Seat Number',
            'Check-in ID', 'Boarding Pass No',
            'Hotel Confirmation No', 'Folio Number', 'Folio No',
            'Property Confirmation No',

            // --- Government / Tax / Compliance ---
            'GST Invoice No', 'GSTIN Invoice No',
            'ARN', 'ARN No', 'Application Reference Number',
            'CIN', 'CIN No', 'Challan Identification Number',
            'TAN No', 'PAN No', 'GSTIN',
            'E-Invoice No', 'IRN', 'IRN No',
            'Acknowledgement No', 'Ack No', 'Ack Number',
            'Filing No', 'Application No', 'Application Number', 'Application ID',
            'Registration No', 'Registration Number', 'Reg No', 'Reg. No.',
            'Certificate No', 'Certificate Number', 'Cert No',
            'License No', 'License Number', 'Licence No',
            'Permit No', 'Permit Number',

            // --- Generic Short-form / OCR Variants ---
            'No.', 'No:', 'No #', 'Num', 'Num.', '#',
            'ID', 'ID:', 'ID No', 'ID Number',
            'Ref', 'Ref.', 'Ref:', 'Ref No.', 'Ref. No.',
            'S.No', 'Sr No', 'Sr. No.', 'Sl No', 'Sl. No.',
        ]
    },

    {
        label: 'transaction_date_anchor',
        phrases: [
            // --- Existing ---
            'Date', 'Date:', 'Invoice Date', 'Bill Date', 'Document Date', 'Issued On',
            'Date of Issue', 'Date Issued', 'Billing Date', 'Transaction Date',
            'Txn Date', 'Order Date', 'Receipt Date', 'Payment Date', 'Statement Date',
            'Created On', 'Created Date', 'Issue Date', 'Due Date', 'Posting Date',
            'Settlement Date', 'Processed Date', 'Purchase Date', 'Booking Date',
            'Delivery Date', 'Value Date', 'Entry Date', 'Transfer Date',
            'Order Placed On', 'Ordered On', 'Delivered On', 'Shipped On',
            'Dt', 'Dt.', 'Dated', 'Transaction Time', 'Date & Time', 'Timestamp',

            // --- Invoice / Bill Date Variants ---
            'Invoice Dt', 'Invoice Dt.', 'Inv Date', 'Inv. Date', 'Inv Dt',
            'Bill Dt', 'Bill Dt.', 'Tax Invoice Date',
            'Document Dt', 'Doc Date', 'Doc Dt',
            'Voucher Date', 'Journal Date', 'Posting Dt',
            'Credit Note Date', 'Debit Note Date',
            'Quotation Date', 'Quote Date', 'Estimate Date',
            'Purchase Order Date', 'PO Date', 'Sales Order Date', 'SO Date',
            'Work Order Date', 'WO Date',
            'Challan Date', 'Delivery Challan Date', 'GRN Date',
            'Proforma Date', 'Proforma Invoice Date',

            // --- Payment / Finance Dates ---
            'Payment Received Date', 'Payment Received On',
            'Transaction Dt', 'Txn Dt', 'Transaction Datetime',
            'Credit Date', 'Debit Date',
            'Clearance Date', 'Clearing Date', 'Cleared On',
            'Authorization Date', 'Auth Date',
            'Verification Date', 'Processed On',
            'Remittance Date', 'Fund Transfer Date',
            'Effective Date', 'Effective From',
            'Maturity Date', 'Expiry Date', 'Expiry', 'Valid Till', 'Valid Until',
            'Renewal Date', 'Next Due Date',
            'Last Payment Date', 'Last Transaction Date',
            'Opening Date', 'Closing Date',
            'Cheque Date', 'DD Date',
            'UPI Date', 'Transfer Dt',

            // --- Banking Statement Dates ---
            'Txn Date', 'Tran Date', 'Trans Date',
            'Booking Date', 'Trade Date',
            'Execution Date', 'Completion Date',
            'Conversion Date', 'Exchange Date',

            // --- E-Commerce Dates ---
            'Order Date', 'Placed On', 'Order Placed', 'Date of Order',
            'Dispatch Date', 'Dispatched On',
            'Shipping Date', 'Shipment Date',
            'Expected Delivery', 'Estimated Delivery',
            'Delivery Dt', 'Received On', 'Delivered Date',
            'Return Date', 'Refund Date', 'Refund Processed On',
            'Cancellation Date', 'Cancelled On',
            'Subscription Date', 'Subscription Start Date', 'Subscription End Date',
            'Activation Date', 'Activation On',

            // --- Travel / Hospitality Dates ---
            'Travel Date', 'Journey Date', 'Departure Date', 'Arrival Date',
            'Check-in Date', 'Check-out Date', 'Check In', 'Check Out',
            'Booking Date', 'Reservation Date',
            'Flight Date', 'Boarding Date',
            'Event Date', 'Service Date',

            // --- Government / Tax Dates ---
            'Assessment Year', 'Financial Year', 'FY', 'AY',
            'Filing Date', 'Filing Dt',
            'Acknowledgement Date',
            'Registration Date', 'Date of Registration',
            'Date of Incorporation', 'Incorporation Date',
            'Certificate Date', 'Date of Issue of Certificate',
            'Due Date of Filing',

            // --- OCR / Formatting Variants ---
            'Date of Transaction', 'Date of Payment', 'Date of Purchase',
            'Date of Invoice', 'Date of Bill', 'Date of Receipt',
            'Date of Delivery', 'Date of Booking', 'Date of Order',
            'Date (DD/MM/YYYY)', 'Date (MM/DD/YYYY)', 'Date (YYYY-MM-DD)',
            'dd/mm/yyyy', 'mm/dd/yyyy',
            'Datetime', 'Date/Time', 'Date Time',
            'Time', 'Time:', 'Time of Transaction',
            'Day', 'Month', 'Year',
            'As On', 'As Of', 'As At',
            'W.E.F.', 'With Effect From'
        ]
    },

    {
        label: 'amount_anchor',
        phrases: [
            // --- Existing ---
            'Total', 'Total Amount', 'Grand Total', 'Invoice Total', 'Final Total',
            'Balance Due', 'Amount Due', 'Total Due', 'Amount Payable', 'Total Payable',
            'Subtotal', 'Net Amount', 'Gross Amount', 'Amount Paid', 'Payment Amount',
            'Tax Amount', 'GST Amount', 'VAT Amount', 'Service Charge', 'Convenience Fee',
            'Shipping Charge', 'Delivery Charge',
            'Outstanding Amount', 'Remaining Balance', 'Payable Amount', 'Due Balance',
            'Paid Amount', 'Transaction Amount', 'Debit Amount', 'Credit Amount',
            'Transfer Amount',
            'Amount', 'Total Paid', 'Final Amount', 'Net Payable',
            'Charges', 'Fees', 'Price', 'Cost', 'Value',

            // --- Invoice Breakdown ---
            'Sub Total', 'Sub-Total', 'Subtotal Amount',
            'Taxable Amount', 'Taxable Value', 'Taxable Base',
            'Gross Total', 'Gross Value', 'Gross Price',
            'Net Total', 'Net Value', 'Net Price',
            'Invoice Amount', 'Bill Amount', 'Receipt Amount',
            'Base Amount', 'Basic Amount', 'Base Price', 'Basic Price',
            'Line Total', 'Item Total', 'Item Amount',
            'Unit Price', 'Rate', 'Unit Rate', 'Rate Per Unit', 'Price Per Unit',
            'MRP', 'Maximum Retail Price', 'Selling Price', 'Listed Price', 'List Price',
            'Discounted Price', 'Discount Amount', 'Discount', 'Less Discount',
            'After Discount', 'Net After Discount',
            'Advance Amount', 'Advance Paid', 'Security Deposit',
            'Balance Amount', 'Pending Amount', 'Remaining Amount',

            // --- Tax / GST / India Specific ---
            'CGST Amount', 'CGST', 'CGST @9%', 'CGST @18%',
            'SGST Amount', 'SGST', 'SGST @9%', 'SGST @18%',
            'IGST Amount', 'IGST', 'IGST @18%',
            'UTGST Amount', 'UTGST',
            'Cess Amount', 'Cess', 'Additional Cess',
            'GST @5%', 'GST @12%', 'GST @18%', 'GST @28%',
            'Tax @ Rate', 'Tax %', 'Tax Rate', 'Tax',
            'TDS Amount', 'TDS', 'TCS Amount', 'TCS',
            'Round Off', 'Rounding Off', 'Round Off Amount',
            'Service Tax', 'Excise Duty', 'Customs Duty',
            'Input Tax Credit', 'ITC',

            // --- International Tax ---
            'VAT', 'VAT @20%', 'Sales Tax', 'HST', 'GST/HST',
            'Withholding Tax', 'WHT',
            'Tax Total', 'Total Tax', 'Total Tax Amount',

            // --- Charges & Fees ---
            'Processing Fee', 'Transaction Fee', 'Platform Fee',
            'Handling Charge', 'Packaging Charge',
            'Installation Charge', 'Installation Fee',
            'Maintenance Charge', 'Maintenance Fee', 'AMC',
            'Late Payment Fee', 'Penalty Amount', 'Penalty',
            'Interest Amount', 'Interest', 'Interest Charged',
            'Bank Charges', 'Bank Fee',
            'EMI Amount', 'EMI', 'Monthly Instalment', 'Instalment Amount',
            'Down Payment', 'Deposit Amount',
            'Stamp Duty', 'Registration Charges',
            'Other Charges', 'Miscellaneous Charges', 'Misc Charges',
            'Add-on Charges', 'Additional Charges', 'Extra Charges',
            'Fuel Surcharge', 'Toll Charges', 'Freight Charges', 'Freight',
            'Insurance Charges', 'Insurance Amount',

            // --- Payment / Receipt ---
            'Cash Amount', 'Cash Paid', 'Cash Received',
            'Card Amount', 'Card Payment',
            'Online Payment', 'Digital Payment',
            'Cheque Amount', 'DD Amount',
            'Total Received', 'Received Amount',
            'Settlement Amount', 'Settled Amount',
            'Refund Amount', 'Refunded Amount', 'Refund',
            'Adjustment Amount', 'Write-off Amount',
            'Opening Balance', 'Closing Balance',
            'Available Balance', 'Current Balance', 'Ledger Balance',
            'Account Balance', 'Wallet Balance',
            'Withdrawal Amount', 'Deposit Amount',
            'Transfer Amount',

            // --- Currency / Numeric Labels ---
            'Rs.', 'Rs', 'INR', 'USD', 'EUR', 'GBP',
            'Amount (INR)', 'Amount (USD)', 'Amount in Words',
            'In Words', 'Amount in Figures',
            'Total (INR)', 'Total (USD)',
            'Cr', 'Dr', 'Credit', 'Debit',

            // --- Summary / Total Rows ---
            'Net Due', 'Amount to be Paid', 'You Pay', 'Pay Now',
            'Total Invoice Value', 'Total Bill Value',
            'Total Order Value', 'Order Total', 'Cart Total',
            'Total Charges', 'Total Fees',
            'Grand Total (Incl. Tax)', 'Grand Total (Excl. Tax)',
            'Total (Incl. GST)', 'Total (Excl. GST)',
            'Total (with Tax)', 'Total (before Tax)',
            'Estimated Total', 'Approx. Amount'
        ]
    },

    {
        label: 'transaction_type_anchor_credit',
        phrases: [

        ]
    },
 
    {
        label: 'transaction_type_anchor_debit',
        phrases: [

        ]
    },

    {
        label: 'description_anchor',
        phrases: [

        ]
    }
];

function trainAndSave() {
    const classifier = new natural.BayesClassifier();

    trainingData.forEach(category => {
        category.phrases.forEach(phrase => {
            classifier.addDocument(phrase, category.label);
        });
    });

    classifier.train();
    saveClassifier();

}


trainAndSave();

module.exports = {
    getClassifier,
    saveClassifier
};