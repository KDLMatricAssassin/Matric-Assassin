const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  mediaUrl: {
    type: String,
    required: false
  },
  mediaType: {
    type: String,
    enum: [null, 'image', 'video'],
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    required: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
postSchema.index({ user: 1, status: 1 });
postSchema.index({ status: 1, createdAt: -1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Method to check if user has liked the post
postSchema.methods.hasLiked = function(userId) {
  return this.likes.some(like => like.equals(userId));
};

// Pre-save hook to handle media type
postSchema.pre('save', function(next) {
  if (this.mediaUrl) {
    if (this.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      this.mediaType = 'image';
    } else if (this.mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
      this.mediaType = 'video';
    }
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
