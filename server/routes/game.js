const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Game routes
router.get('/status', protect, (req, res) => {
  res.json({ status: 'Game is running' });
});

// Add more game-related routes here

module.exports = router;
