require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Import routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const adminRoutes = require('./routes/admin');
const gameRoutes = require('./routes/game');
const postRoutes = require('./routes/posts');

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

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:10000',
      'http://127.0.0.1:10000',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:5000',
      'http://127.0.0.1:5000'
    ];
    
    // For development, allow all origins with credentials
    if (process.env.NODE_ENV === 'development') {
      return callback(null, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With']
      });
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, {
        origin: true,
        credentials: true
      });
    } else {
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Middleware
app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        // Set proper cache control for static files
        res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
}));

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan('dev'));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Serve static files from the root directory (for frontend)
app.use(express.static(path.join(__dirname, '..')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/admin', protect, admin, adminRoutes);
app.use('/api/game', protect, gameRoutes);
app.use('/api/posts', postRoutes);

// Handle React routing, return all requests to the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

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
app.use('/api/posts', postRoutes);

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

// Default MongoDB connection string if not in .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matric-assassin';

mongoose
  .connect(MONGODB_URI, {
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
