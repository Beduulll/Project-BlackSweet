const express = require('express');
const router = express.Router();
const c = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/login', c.login);
router.post('/register', c.register);
router.post('/forgot/question', c.getSecurityQuestion);
router.post('/forgot/reset', c.resetPassword);
router.get('/me', requireAuth, c.me);

module.exports = router;
