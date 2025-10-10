# Social Plex

A modern social media platform built with Next.js, featuring real-time chat, stories, and social connections. Optimized for Vercel deployment.

## Features

- 🔐 **Authentication**: Secure user registration and login with OTP verification
- 💬 **Real-time Chat**: Socket.IO powered messaging with typing indicators
- 📱 **Stories**: Share temporary content with your network
- 👥 **Social Network**: Follow users, create posts, and build connections
- 🖼️ **Media Upload**: Cloudinary integration for images and files
- 📊 **Admin Dashboard**: User management and analytics
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS and Radix UI

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO (integrated into Next.js API routes)
- **Authentication**: JWT with bcrypt
- **File Upload**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd social_plex
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Update `.env.local` with your credentials:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
social_plex/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main app pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and models
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

## Environment Variables

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Your app URL
- `FRONTEND_URL` - Frontend URL for CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.