const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Player = require('../models/Player');
const Game = require('../models/Game');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// Middleware to check if user is a game admin
const gameAdmin = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    
    // Check if the user is a game admin
    const game = await Game.findOne({
      _id: gameId,
      $or: [
        { createdBy: req.user._id },
        { admins: req.user._id }
      ]
    });
    
    if (game) {
      req.game = game;
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as a game admin' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is a player in the game
const player = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    
    // Check if the user is a player in the game
    const player = await Player.findOne({
      user: req.user._id,
      game: gameId
    });
    
    if (player) {
      req.player = player;
      next();
    } else {
      res.status(403).json({ message: 'Not a player in this game' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is the target's hunter
const isTargetHunter = async (req, res, next) => {
  try {
    const { targetId } = req.params;
    
    // Check if the current player is the hunter of the target
    const target = await Player.findOne({
      _id: targetId,
      hunter: req.player._id
    });
    
    if (target) {
      req.target = target;
      next();
    } else {
      res.status(403).json({ message: 'You are not the hunter of this target' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if the game is active
const gameActive = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    if (game.status !== 'active') {
      return res.status(400).json({ 
        message: 'This game is not currently active',
        status: game.status
      });
    }
    
    req.game = game;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  protect,
  admin,
  gameAdmin,
  player,
  isTargetHunter,
  gameActive
};
