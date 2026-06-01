const express = require('express');
const router = express.Router();
const { loginUser, getMe, registerUser } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/register', protect, isAdmin, registerUser);

module.exports = router;
