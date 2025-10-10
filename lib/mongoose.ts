import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI || process.env.DB_STRING

if (!MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local")
}

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default mongoose
