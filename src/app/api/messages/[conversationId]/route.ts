import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import Conversation from "@/lib/models/Conversation"
import Message from "@/lib/models/Message"

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { conversationId } = await params

    await connectDB()

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: currentUser._id,
    })

    if (!conversation) {
      return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 })
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).limit(100).lean()

    return NextResponse.json({
      success: true,
      messages: messages.map((msg) => ({
        ...msg,
        _id: msg._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
