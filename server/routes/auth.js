const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/authController');

// Authentication routes
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;
