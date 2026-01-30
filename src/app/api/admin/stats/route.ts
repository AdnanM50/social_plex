import { NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"
import { connectDB } from "@/src/lib/mongoose"
import User from "@/src/lib/models/User"
import Post from "@/src/lib/models/Post"
import Message from "@/src/lib/models/Message"
import Conversation from "@/src/lib/models/Conversation"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const totalUsers = await User.countDocuments()
    const totalPosts = await Post.countDocuments()
    const totalMessages = await Message.countDocuments()
    const totalConversations = await Conversation.countDocuments()

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    })

    // Get active users (posted in last 7 days)
    const activePosts = await Post.distinct("userId", {
      createdAt: { $gte: sevenDaysAgo },
    })
    const activeUsers = activePosts.length

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPosts,
        totalMessages,
        totalConversations,
        newUsers,
        activeUsers,
      },
    })
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
