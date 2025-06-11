const Game = require('../models/Game');
const User = require('../models/User');

// Approve or reject a post
const approvePost = async (req, res) => {
  try {
    const { gameId, postId } = req.params;
    const { status } = req.body;
    const adminId = req.user._id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const post = game.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = status;
    post.approvedBy = adminId;
    post.updatedAt = new Date();
    
    await game.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(gameId).emit('post_updated', { postId, status });

    res.json({ message: `Post ${status} successfully` });
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a player as eliminated
const eliminatePlayer = async (req, res) => {
  try {
    const { gameId, playerId } = req.params;
    const { proofUrl } = req.body;
    const adminId = req.user._id;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const playerStatus = game.playerStatuses.find(
      status => status.player.toString() === playerId
    );

    if (!playerStatus) {
      return res.status(404).json({ message: 'Player not found in this game' });
    }

    // Update player status
    playerStatus.status = 'eliminated';
    playerStatus.eliminationDate = new Date();
    playerStatus.eliminationProof = proofUrl;
    playerStatus.eliminationApproved = true;
    playerStatus.approvedBy = adminId;

    await game.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(gameId).emit('player_eliminated', { 
      playerId, 
      gameId,
      eliminatedBy: adminId,
      timestamp: new Date()
    });

    res.json({ message: 'Player marked as eliminated' });
  } catch (error) {
    console.error('Error eliminating player:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all pending approvals
const getPendingApprovals = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    const game = await Game.findById(gameId)
      .populate('posts.author', 'name email')
      .populate('playerStatuses.player', 'name email');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const pendingPosts = game.posts.filter(post => post.status === 'pending');
    const pendingEliminations = game.playerStatuses.filter(
      status => status.eliminationProof && !status.eliminationApproved
    );

    res.json({
      pendingPosts,
      pendingEliminations
    });
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update game status
const updateGameStatus = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { status } = req.body;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.status = status;
    
    if (status === 'active' && !game.startDate) {
      game.startDate = new Date();
    } else if (status === 'completed') {
      game.endDate = new Date();
    }

    await game.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(gameId).emit('game_status_updated', { 
      gameId,
      status,
      startDate: game.startDate,
      endDate: game.endDate
    });

    res.json({ 
      message: `Game status updated to ${status}`,
      game
    });
  } catch (error) {
    console.error('Error updating game status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  approvePost,
  eliminatePlayer,
  getPendingApprovals,
  updateGameStatus
};
