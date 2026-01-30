import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  username: string
  email: string
  password: string
  fullName: string
  bio?: string
  avatar?: string
  coverImage?: string
  isVerified: boolean
  isAdmin: boolean
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  chatRequests: {
    sent: mongoose.Types.ObjectId[]
    received: mongoose.Types.ObjectId[]
  }
  otp?: string
  otpExpires?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    coverImage: { type: String },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chatRequests: {
      sent: [{ type: Schema.Types.ObjectId, ref: "User" }],
      received: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
