require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const adminRoutes = require('./routes/admin');
const gameRoutes = require('./routes/game');

// Import middleware
const { protect, admin } = require('./middleware/auth');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://your-frontend-domain.com' 
      : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join game room
  socket.on('joinGame', ({ gameId, userId }) => {
    socket.join(gameId);
    console.log(`Client ${socket.id} joined game: ${gameId}`);
    
    // Store user info in socket
    socket.userId = userId;
    socket.gameId = gameId;
  });

  // Handle post creation
  socket.on('createPost', async ({ gameId, content, userId }) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      const newPost = {
        content,
        author: userId,
        status: 'pending'
      };
      
      game.posts.push(newPost);
      await game.save();
      
      // Notify admins of new pending post
      io.to(`admin-${gameId}`).emit('new_pending_post', {
        post: { ...newPost, _id: game.posts[game.posts.length - 1]._id }
      });
      
      socket.emit('post_created', { message: 'Post submitted for approval' });
    } catch (error) {
      console.error('Error creating post:', error);
      socket.emit('error', { message: 'Failed to create post' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);
app.set('gameNamespace', io.of('/game'));

// Make io accessible to routes
app.set('io', io);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);

// Protected admin routes
app.use('/api/admin', protect, admin, adminRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = { app, server };
