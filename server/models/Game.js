const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const playerStatusSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['alive', 'eliminated', 'suspended'],
    default: 'alive'
  },
  eliminatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  eliminationDate: {
    type: Date
  },
  eliminationProof: {
    type: String // URL to image/video
  },
  eliminationApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['setup', 'active', 'completed', 'paused'],
    default: 'setup'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  rules: {
    type: String,
    default: ''
  },
  safeZones: [{
    name: String,
    description: String,
    location: String,
    active: {
      type: Boolean,
      default: true
    }
  }],
  // Game posts (announcements, updates, etc.)
  posts: [postSchema],
  
  // Player statuses
  playerStatuses: [playerStatusSchema],
  
  // Game configuration
  eliminationRules: {
    requiresVideo: {
      type: Boolean,
      default: true
    },
    requiresApproval: {
      type: Boolean,
      default: true
    },
    timeLimit: {
      type: Number, // in hours
      default: 48
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  secondPlace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  thirdPlace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  joinCode: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique join code
gameSchema.methods.generateJoinCode = async function() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  // Keep generating until we find a unique code
  let isUnique = false;
  while (!isUnique) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const existingGame = await mongoose.model('Game').findOne({ joinCode: code });
    if (!existingGame || existingGame._id.equals(this._id)) {
      isUnique = true;
    }
  }
  
  this.joinCode = code;
  return code;
};

// Get game statistics
gameSchema.methods.getStats = async function() {
  const stats = await mongoose.model('Player').aggregate([
    { $match: { game: this._id } },
    { 
      $lookup: {
        from: 'eliminations',
        localField: '_id',
        foreignField: 'eliminatedBy',
        as: 'eliminations'
      }
    },
    {
      $project: {
        name: 1,
        status: 1,
        eliminationCount: { $size: '$eliminations' },
        isAdmin: 1
      }
    },
    { $sort: { eliminationCount: -1, name: 1 } }
  ]);
  
  return stats;
};

// Update game status based on active players
gameSchema.methods.updateGameStatus = async function() {
  const activePlayers = await mongoose.model('Player').countDocuments({
    game: this._id,
    status: 'active'
  });
  
  if (activePlayers <= 1 && this.status === 'active') {
    this.status = 'completed';
    this.endDate = Date.now();
    
    // Get the winner and update standings
    const winner = await mongoose.model('Player').findOne({
      game: this._id,
      status: 'active'
    });
    
    if (winner) {
      this.winner = winner._id;
      
      // Get the last eliminated player for second place
      const lastElimination = await mongoose.model('Elimination')
        .findOne({ game: this._id })
        .sort({ createdAt: -1 })
        .populate('eliminatedBy', 'name');
        
      if (lastElimination && lastElimination.eliminatedBy) {
        this.secondPlace = lastElimination.eliminatedBy._id;
      }
      
      // Get second to last elimination for third place
      const secondLastElimination = await mongoose.model('Elimination')
        .find({ 
          game: this._id,
          _id: { $ne: lastElimination?._id }
        })
        .sort({ createdAt: -1 })
        .limit(1)
        .populate('eliminatedBy', 'name');
        
      if (secondLastElimination.length > 0 && secondLastElimination[0].eliminatedBy) {
        this.thirdPlace = secondLastElimination[0].eliminatedBy._id;
      }
    }
    
    await this.save();
    
    // Emit game over event
    const io = require('../server').io;
    io.to(this._id.toString()).emit('gameOver', {
      winner: winner ? winner.name : 'No winner',
      stats: await this.getStats()
    });
  }
  
  return this.status;
};

// Pre-save hook to update timestamps
gameSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Game', gameSchema);
