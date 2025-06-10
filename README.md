# Senior Assassin Game

A real-time web application for managing the Senior Assassin game with live updates, target assignments, and elimination tracking.

## Features

- 🔐 Secure player authentication with unique codes
- 🎯 Automatic target assignment and chaining
- 📱 Real-time game updates
- 🎥 Video uploads for eliminations (admin only)
- 📊 Live leaderboard with podium display
- 👑 Admin dashboard for game management

## Tech Stack

- **Frontend**: React.js, Material-UI, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT
- **Video Hosting**: Cloudinary

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for video uploads)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables (see .env.example files)

4. Start the development servers:
   ```bash
   # Start backend
   cd server
   npm run dev
   
   # Start frontend (in a new terminal)
   cd ../client
   npm start
   ```

## Deployment

### Backend
Deploy the server to Render, Heroku, or Railway.

### Frontend
Deploy the React app to Netlify or Vercel.

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com,admin4@example.com
```

### Client (.env)
```
REACT_APP_API_URL=your_backend_url
REACT_APP_SOCKET_URL=your_socket_url
```

## License
MIT
