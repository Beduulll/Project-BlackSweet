const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/statsController');

router.get('/', getSummary);

module.exports = router;
