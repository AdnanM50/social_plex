# Social Media Chat App

A full-stack real-time social media and chat application built with Next.js, Express.js, Socket.IO, and MongoDB.

## Features

- Real-time messaging with Socket.IO
- User authentication (JWT + OTP)
- Social feed with posts, likes, and comments
- Stories feature
- User profiles with followers/following
- Image uploads with Cloudinary
- Admin dashboard
- PWA support
- Responsive design

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Socket.IO Client

### Backend
- Express.js
- Socket.IO
- MongoDB
- JWT Authentication
- Cloudinary

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Frontend Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create `.env.local`:
\`\`\`env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
\`\`\`

3. Run development server:
\`\`\`bash
npm run dev
\`\`\`

### Backend Setup

See `backend/README.md` for detailed backend setup instructions.

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render/Railway)
See `backend/README.md` for deployment instructions.

## Environment Variables

### Frontend (.env.local)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `NEXT_PUBLIC_SOCKET_URL` - Backend Socket.IO URL
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Backend (.env)
See `backend/.env.example`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main app pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities and helpers
├── backend/               # Express.js backend
│   └── server.ts          # Socket.IO server
└── scripts/               # Database scripts
\`\`\`

## License

MIT
