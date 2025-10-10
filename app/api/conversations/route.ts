import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import Conversation from "@/lib/models/Conversation"
import User from "@/lib/models/User"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: currentUser._id,
    })
      .sort({ updatedAt: -1 })
      .lean()

    // Get participant details for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participants.find((id) => id.toString() !== currentUser._id)
        const otherUser = await User.findById(otherUserId).select("username fullName avatar").lean()

        return {
          _id: conv._id.toString(),
          participants: conv.participants,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount?.get(currentUser._id) || 0,
          otherUser: otherUser
            ? {
                _id: otherUser._id.toString(),
                username: otherUser.username,
                fullName: otherUser.fullName,
                avatar: otherUser.avatar,
              }
            : null,
          updatedAt: conv.updatedAt,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      conversations: conversationsWithDetails,
    })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
