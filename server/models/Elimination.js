const mongoose = require('mongoose');

const eliminationSchema = new mongoose.Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  eliminatedPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  eliminatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  videoUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    name: String
  },
  evidence: [{
    type: String,
    default: []
  }],
  witnesses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: []
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
eliminationSchema.index({ game: 1, status: 1 });
eliminationSchema.index({ eliminatedPlayer: 1 });
eliminationSchema.index({ eliminatedBy: 1 });

// Virtual for time since elimination
eliminationSchema.virtual('timeSinceElimination').get(function() {
  return Date.now() - this.reportedAt;
});

// Pre-save hook to update player status when an elimination is approved
eliminationSchema.pre('save', async function(next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approvedAt) {
    try {
      const Player = mongoose.model('Player');
      const Game = mongoose.model('Game');
      
      // Update the eliminated player's status
      await Player.findByIdAndUpdate(this.eliminatedPlayer, {
        status: 'eliminated',
        eliminationDate: Date.now()
      });
      
      // Update the game status
      const game = await Game.findById(this.game);
      if (game) {
        await game.updateGameStatus();
      }
      
      this.approvedAt = Date.now();
      
      // Emit real-time update
      const io = require('../server').io;
      io.to(this.game.toString()).emit('eliminationApproved', {
        elimination: this,
        gameId: this.game
      });
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Static method to get elimination statistics
eliminationSchema.statics.getStats = async function(gameId) {
  const stats = await this.aggregate([
    { $match: { game: mongoose.Types.ObjectId(gameId), status: 'approved' } },
    {
      $group: {
        _id: '$eliminatedBy',
        count: { $sum: 1 },
        lastElimination: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1, lastElimination: 1 } },
    {
      $lookup: {
        from: 'players',
        localField: '_id',
        foreignField: '_id',
        as: 'player'
      }
    },
    { $unwind: '$player' },
    {
      $project: {
        playerId: '$_id',
        playerName: '$player.name',
        eliminations: '$count',
        lastElimination: 1
      }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('Elimination', eliminationSchema);
