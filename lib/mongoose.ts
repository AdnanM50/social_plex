import mongoose from "mongoose"

const DB_STRING = process.env.DB_STRING

if (!DB_STRING) {
  throw new Error("Please add your DB_STRING to .env.local")
}

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    return
  }

  try {
    await mongoose.connect(DB_STRING)
    isConnected = true
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default mongoose
