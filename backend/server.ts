import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import Message from "../lib/models/Message"
import Conversation from "../lib/models/Conversation"

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())

// MongoDB connection with Mongoose
mongoose
  .connect(process.env.DB_STRING || "")
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Socket.IO connection handling
const userSockets = new Map<string, string>() // userId -> socketId

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // User authentication and registration
  socket.on("register", (userId: string) => {
    userSockets.set(userId, socket.id)
    socket.join(userId)
    console.log(`User ${userId} registered with socket ${socket.id}`)
  })

  // Join conversation room
  socket.on("join-conversation", (conversationId: string) => {
    socket.join(conversationId)
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`)
  })

  // Send message
  socket.on(
    "send-message",
    async (data: {
      conversationId: string
      senderId: string
      content: string
      type: "text" | "image" | "file"
      fileUrl?: string
    }) => {
      try {
        // Save message to database using Mongoose
        const message = await Message.create({
          conversationId: data.conversationId,
          senderId: data.senderId,
          content: data.content,
          type: data.type,
          fileUrl: data.fileUrl,
          readBy: [data.senderId],
        })

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(data.conversationId, {
          lastMessage: {
            senderId: data.senderId,
            content: data.content,
            createdAt: new Date(),
          },
          updatedAt: new Date(),
        })

        // Emit message to conversation room
        io.to(data.conversationId).emit("new-message", message)
      } catch (error) {
        console.error("Error sending message:", error)
        socket.emit("error", { message: "Failed to send message" })
      }
    },
  )

  // Typing indicator
  socket.on("typing", (data: { conversationId: string; userId: string }) => {
    socket.to(data.conversationId).emit("user-typing", data)
  })

  socket.on("stop-typing", (data: { conversationId: string; userId: string }) => {
    socket.to(data.conversationId).emit("user-stop-typing", data)
  })

  // Mark messages as read
  socket.on("mark-read", async (data: { conversationId: string; userId: string }) => {
    try {
      await Message.updateMany(
        {
          conversationId: data.conversationId,
          senderId: { $ne: data.userId },
        },
        { $addToSet: { readBy: data.userId } },
      )

      await Conversation.findByIdAndUpdate(data.conversationId, {
        [`unreadCount.${data.userId}`]: 0,
      })

      io.to(data.conversationId).emit("messages-read", data)
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  })

  // Online status
  socket.on("user-online", (userId: string) => {
    io.emit("user-status", { userId, status: "online" })
  })

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)

    // Find and remove user from userSockets
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId)
        io.emit("user-status", { userId, status: "offline" })
        break
      }
    }
  })
})

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
