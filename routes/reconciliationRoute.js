const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reconciliationController = require('../controller/reconciliationController');

// Run the automated reconciliation matching algorithm
router.post('/run', authMiddleware, reconciliationController.runReconciliation);

module.exports = router;
