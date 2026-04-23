const express = require('express');
const { updateActiveBusiness } = require('../controller/settingsController');
const verifyToken = require('../middleware/authMiddleware'); 
const router = express.Router();

router.put('/active-business', verifyToken, updateActiveBusiness);

module.exports = router;