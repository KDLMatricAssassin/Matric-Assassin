const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['active', 'eliminated', 'disqualified'],
    default: 'active'
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  hunter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  eliminationVideo: {
    type: String,
    default: null
  },
  eliminationDate: {
    type: Date,
    default: null
  },
  eliminationNotes: {
    type: String,
    default: ''
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
playerSchema.index({ game: 1, status: 1 });
playerSchema.index({ game: 1, user: 1 }, { unique: true });
playerSchema.index({ game: 1, target: 1 });
playerSchema.index({ game: 1, hunter: 1 });

// Virtual for elimination count
playerSchema.virtual('eliminationCount', {
  ref: 'Elimination',
  localField: '_id',
  foreignField: 'eliminatedBy',
  count: true
});

// Method to get player's current target chain
playerSchema.methods.getTargetChain = async function() {
  const chain = [];
  let currentTarget = this.target;
  
  while (currentTarget) {
    const targetPlayer = await this.model('Player').findById(currentTarget)
      .select('name status target')
      .lean();
    
    if (!targetPlayer) break;
    
    chain.push({
      _id: targetPlayer._id,
      name: targetPlayer.name,
      status: targetPlayer.status
    });
    
    currentTarget = targetPlayer.target;
  }
  
  return chain;
};

// Middleware to handle target reassignment when a player is eliminated
playerSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'eliminated' && this.target) {
    try {
      // Find the player who is targeting the eliminated player
      const hunter = await this.model('Player').findOne({ 
        target: this._id,
        game: this.game,
        status: 'active'
      });
      
      if (hunter) {
        // Reassign the target to the eliminated player's target
        hunter.target = this.target;
        await hunter.save();
        
        // Emit a real-time update
        const io = require('../server').io;
        io.to(this.game.toString()).emit('targetUpdated', {
          playerId: hunter._id,
          newTarget: hunter.target
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Player', playerSchema);
