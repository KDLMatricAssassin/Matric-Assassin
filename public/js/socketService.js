class SocketService {
  constructor() {
    this.socket = null;
    this.gameId = null;
    this.userId = null;
    this.callbacks = {
      onPostUpdated: [],
      onPlayerEliminated: [],
      onGameStatusUpdated: [],
      onError: []
    };
  }

  // Initialize socket connection
  connect(gameId, userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.gameId = gameId;
    this.userId = userId;
    
    // Connect to the WebSocket server
    this.socket = io({
      path: '/socket.io',
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.joinGame();
    });

    this.socket.on('post_updated', this.handlePostUpdated.bind(this));
    this.socket.on('player_eliminated', this.handlePlayerEliminated.bind(this));
    this.socket.on('game_status_updated', this.handleGameStatusUpdated.bind(this));
    this.socket.on('error', this.handleError.bind(this));
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Join a game room
  joinGame() {
    if (!this.socket || !this.gameId || !this.userId) {
      console.error('Socket, gameId, or userId not set');
      return;
    }
    
    this.socket.emit('joinGame', {
      gameId: this.gameId,
      userId: this.userId
    });
  }

  // Create a new post
  createPost(content) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.gameId || !this.userId) {
        reject(new Error('Socket, gameId, or userId not set'));
        return;
      }

      this.socket.emit('createPost', {
        gameId: this.gameId,
        content,
        userId: this.userId
      }, (response) => {
        if (response.error) {
          reject(new Error(response.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  // Handle post updates
  handlePostUpdated(data) {
    this.callbacks.onPostUpdated.forEach(callback => callback(data));
  }

  // Handle player elimination
  handlePlayerEliminated(data) {
    this.callbacks.onPlayerEliminated.forEach(callback => callback(data));
  }

  // Handle game status updates
  handleGameStatusUpdated(data) {
    this.callbacks.onGameStatusUpdated.forEach(callback => callback(data));
  }

  // Handle errors
  handleError(error) {
    console.error('WebSocket error:', error);
    this.callbacks.onError.forEach(callback => callback(error));
  }

  // Register callbacks
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Create a singleton instance
export const socketService = new SocketService();
