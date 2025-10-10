# Vercel Deployment Guide for Social Plex

This guide will help you deploy your Social Plex application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB Atlas account (for database)
3. A Cloudinary account (for image uploads)

## Step 1: Prepare Your Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/social_plex?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-app-name.vercel.app

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app-name.vercel.app
```

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel deployment
5. Get your connection string and update `MONGODB_URI`

## Step 3: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a new account
3. Get your cloud name, API key, and API secret from the dashboard
4. Update the Cloudinary environment variables

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Set environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add CLOUDINARY_CLOUD_NAME
   vercel env add CLOUDINARY_API_KEY
   vercel env add CLOUDINARY_API_SECRET
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add FRONTEND_URL
   ```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables in the project settings
6. Deploy

## Step 5: Configure Environment Variables in Vercel

In your Vercel project dashboard:

1. Go to Settings → Environment Variables
2. Add each environment variable:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret string
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NEXTAUTH_SECRET`: A random secret string
   - `NEXTAUTH_URL`: Your Vercel app URL
   - `FRONTEND_URL`: Your Vercel app URL

## Step 6: Update Your App URL

After deployment, update your environment variables with the actual Vercel URL:

1. Go to your Vercel project dashboard
2. Copy your app URL (e.g., `https://your-app-name.vercel.app`)
3. Update `NEXTAUTH_URL` and `FRONTEND_URL` with this URL
4. Redeploy if necessary

## Important Notes

1. **Socket.IO**: The app now uses Next.js API routes for Socket.IO instead of a separate backend server
2. **Database**: Make sure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0)
3. **Environment Variables**: Never commit your `.env.local` file to Git
4. **Build Optimization**: The app is configured for optimal Vercel deployment

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify MongoDB URI and network access
3. **Socket.IO Issues**: Ensure the API route is properly configured
4. **Image Upload**: Verify Cloudinary credentials

### Useful Commands:

```bash
# Check build locally
npm run build

# Test production build
npm run start

# View Vercel logs
vercel logs
```

## Post-Deployment

1. Test all features: authentication, chat, image uploads
2. Monitor the Vercel dashboard for any errors
3. Set up custom domain if needed
4. Configure analytics and monitoring

Your Social Plex app should now be live on Vercel! 🚀
