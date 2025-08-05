const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getStats } = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/shorten', authMiddleware, shortenUrl);
router.get('/stats/:code', getStats);
router.get('/:code', redirectUrl);

module.exports = router;
