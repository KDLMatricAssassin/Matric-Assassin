const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Player routes
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// Add more player-related routes here

module.exports = router;
