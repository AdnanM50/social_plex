import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"
import { connectDB } from "@/src/lib/mongoose"
import Conversation from "@/src/lib/models/Conversation"

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 })
    }

    await connectDB()

    const existingConversation = await Conversation.findOne({
      participants: { $all: [currentUser._id, userId] },
    })

    if (existingConversation) {
      return NextResponse.json({
        success: true,
        conversationId: existingConversation._id.toString(),
      })
    }

    const conversation = await Conversation.create({
      participants: [currentUser._id, userId],
      unreadCount: {
        [currentUser._id]: 0,
        [userId]: 0,
      },
    })

    return NextResponse.json({
      success: true,
      conversationId: conversation._id.toString(),
    })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
