const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
    upload,
    listBusinesses,
    createBusiness,
    listVendors,
    createVendor,
    uploadInvoice,
    uploadStatement,
    listReconciliation
} = require('../controller/appController');

const router = express.Router();

router.use(authMiddleware);

router.get('/businesses', listBusinesses);
router.post('/businesses', createBusiness);

router.get('/vendors', listVendors);
router.post('/vendors', createVendor);

router.post('/invoices/upload', upload.single('invoice'), uploadInvoice);
router.post('/statements/upload', upload.single('statement'), uploadStatement);

router.get('/reconciliation', listReconciliation);

module.exports = router;
