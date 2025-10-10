# Complete Setup Guide

This guide will walk you through setting up the entire Social Media Chat App from scratch.

## Prerequisites

- Node.js 18 or higher
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)
- Git

## Step 1: Clone/Download the Project

Download the project ZIP or clone from GitHub.

## Step 2: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `flex-media` or your preferred name

Your connection string should look like:
\`\`\`
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/flex-media?retryWrites=true&w=majority
\`\`\`

## Step 3: Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account or sign in
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Step 4: Frontend Setup

1. Open terminal in the project root directory

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create `.env.local` file in the root directory:
\`\`\`env
DB_STRING=your-mongodb-connection-string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
\`\`\`

4. Generate JWT secrets (run in terminal):
\`\`\`bash
# For JWT_ACCESS_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

5. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Frontend will run on `http://localhost:3000`

## Step 5: Backend Setup

1. Open a new terminal window

2. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

3. Install dependencies:
\`\`\`bash
npm install
\`\`\`

4. Create `.env` file in the backend directory:
\`\`\`env
PORT=4000
DB_STRING=your-mongodb-connection-string
JWT_ACCESS_SECRET=same-as-frontend
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=same-as-frontend
JWT_REFRESH_EXPIRES_IN=7d
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
FRONTEND_URL=http://localhost:3000
\`\`\`

**Important:** Use the SAME JWT secrets in both frontend and backend!

5. Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

Backend will run on `http://localhost:4000`

## Step 6: Test the Application

1. Open `http://localhost:3000` in your browser
2. Click "Sign Up" to create a new account
3. Enter your details and verify OTP (check console for OTP in development)
4. Start using the app!

## Step 7: Create Admin User

To access the admin dashboard:

1. Sign up for a new account
2. Open MongoDB Atlas
3. Go to your cluster → Browse Collections
4. Find the `users` collection
5. Find your user document
6. Edit the document and set `isAdmin: true`
7. Save changes
8. Refresh the app and you'll see the Admin link in navigation

## Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add all environment variables from `.env.local`
5. Update `NEXT_PUBLIC_SOCKET_URL` to your backend URL (after deploying backend)
6. Deploy

### Deploy Backend to Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Settings:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Root Directory: Leave empty
5. Add all environment variables from backend `.env`
6. Update `FRONTEND_URL` to your Vercel URL
7. Deploy
8. Copy the backend URL and update `NEXT_PUBLIC_SOCKET_URL` in Vercel

## Troubleshooting

### "Cannot connect to database"
- Check your MongoDB connection string
- Verify your IP is whitelisted in MongoDB Atlas (use 0.0.0.0/0 for all IPs)
- Ensure password doesn't contain special characters that need URL encoding

### "Socket.IO connection failed"
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_SOCKET_URL` in frontend `.env.local`
- Ensure no firewall is blocking the connection

### "Cloudinary upload failed"
- Verify your Cloudinary credentials
- Check API key and secret are correct
- Ensure cloud name matches your account

### "JWT token invalid"
- Make sure JWT secrets match in both frontend and backend
- Clear browser cookies and try logging in again

## Features Overview

- **Authentication**: JWT-based with OTP verification
- **Chat**: Real-time messaging with Socket.IO
- **Social Feed**: Create posts, like, comment
- **Stories**: 24-hour temporary stories
- **Profiles**: Customizable with avatar and cover images
- **Admin Dashboard**: User management and statistics
- **Responsive**: Works on mobile, tablet, and desktop

## Support

For issues or questions, please check:
- MongoDB Atlas documentation
- Cloudinary documentation
- Next.js documentation
- Socket.IO documentation
