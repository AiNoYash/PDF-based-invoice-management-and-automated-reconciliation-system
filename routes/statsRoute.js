const express = require('express');
const router = express.Router();

// TODO: Implement dashboard stats endpoint
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Stats endpoint – coming soon.' });
});

module.exports = router;