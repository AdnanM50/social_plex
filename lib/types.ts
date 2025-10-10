// User Types
export interface User {
  _id: string
  username: string
  email: string
  password: string
  fullName: string
  bio?: string
  avatar?: string
  coverImage?: string
  followers: string[]
  following: string[]
  isVerified: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

// Post Types
export interface Post {
  _id: string
  userId: string
  content: string
  images?: string[]
  likes: string[]
  comments: Comment[]
  shares: number
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id: string
  userId: string
  content: string
  createdAt: Date
}

// Story Types
export interface Story {
  _id: string
  userId: string
  image: string
  caption?: string
  views: string[]
  expiresAt: Date
  createdAt: Date
}

// Chat Types
export interface Conversation {
  _id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: { [userId: string]: number }
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  _id: string
  conversationId: string
  senderId: string
  content: string
  type: "text" | "image" | "file"
  fileUrl?: string
  readBy: string[]
  createdAt: Date
}

// Notification Types
export interface Notification {
  _id: string
  userId: string
  type: "like" | "comment" | "follow" | "message"
  fromUserId: string
  postId?: string
  content: string
  read: boolean
  createdAt: Date
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  username: string
  email: string
  password: string
  fullName: string
}

export interface OTPVerification {
  email: string
  otp: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: Partial<User>
  message?: string
}
