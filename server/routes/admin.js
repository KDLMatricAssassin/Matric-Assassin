const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  approvePost,
  eliminatePlayer,
  getPendingApprovals,
  updateGameStatus
} = require('../controllers/adminController');

// Protect all routes with authentication and admin check
router.use(protect);
router.use(admin);

// Approve or reject a post
router.put('/games/:gameId/posts/:postId/approve', approvePost);

// Mark a player as eliminated
router.post('/games/:gameId/players/:playerId/eliminate', eliminatePlayer);

// Get all pending approvals
router.get('/games/:gameId/pending-approvals', getPendingApprovals);

// Update game status
router.put('/games/:gameId/status', updateGameStatus);

module.exports = router;
