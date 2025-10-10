# Social Chat App - Backend Server

This is the Express.js + Socket.IO backend server for the social media chat application.

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Variables

Create a `.env` file in the backend directory and add the following variables:

\`\`\`env
PORT=4000
DB_STRING=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flex-media?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=http://localhost:3000
\`\`\`

**Important:** The JWT secrets must match the ones in your frontend `.env.local` file!

### 3. MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier works)
3. Get your connection string and add it to `.env` as `DB_STRING`
4. The Mongoose models will create collections automatically

### 4. Run the Server

Development mode:
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm run build
npm start
\`\`\`

The server will run on `http://localhost:4000`

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
4. Add all environment variables from `.env`
5. Copy the deployed URL and update `NEXT_PUBLIC_SOCKET_URL` in your frontend

### Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Set Root Directory to `backend`
4. Add all environment variables
5. Railway will auto-detect and deploy
6. Copy the deployed URL and update `NEXT_PUBLIC_SOCKET_URL` in your frontend

## Socket.IO Events

### Client → Server
- `register` - Register user with socket
- `join-conversation` - Join a conversation room
- `send-message` - Send a message
- `typing` - User is typing
- `stop-typing` - User stopped typing
- `mark-read` - Mark messages as read
- `user-online` - User came online

### Server → Client
- `new-message` - New message received
- `user-typing` - User is typing
- `user-stop-typing` - User stopped typing
- `messages-read` - Messages marked as read
- `user-status` - User online/offline status
- `error` - Error occurred

## Tech Stack

- Express.js - Web framework
- Socket.IO - Real-time communication
- Mongoose - MongoDB ODM
- JWT - Authentication
- Cloudinary - Image uploads
- bcryptjs - Password hashing
