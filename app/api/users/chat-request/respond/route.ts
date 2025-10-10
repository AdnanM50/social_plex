import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import Conversation from "@/lib/models/Conversation"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { requesterId, action } = await request.json()

    if (!requesterId || !action) {
      return NextResponse.json({ success: false, message: "Requester ID and action are required" }, { status: 400 })
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ success: false, message: "Action must be 'accept' or 'reject'" }, { status: 400 })
    }

    // Check if request exists
    const currentUserDoc = await User.findById(currentUser._id)
    if (!currentUserDoc?.chatRequests.received.includes(requesterId)) {
      return NextResponse.json({ success: false, message: "Chat request not found" }, { status: 404 })
    }

    if (action === "accept") {
      // Create conversation
      const conversation = new Conversation({
        participants: [currentUser._id, requesterId],
        unreadCount: new Map(),
      })
      await conversation.save()

      // Remove from both users' request lists
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { "chatRequests.received": requesterId },
      })

      await User.findByIdAndUpdate(requesterId, {
        $pull: { "chatRequests.sent": currentUser._id },
      })

      return NextResponse.json({
        success: true,
        message: "Chat request accepted",
        conversationId: conversation._id,
      })
    } else {
      // Reject - just remove from both users' request lists
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { "chatRequests.received": requesterId },
      })

      await User.findByIdAndUpdate(requesterId, {
        $pull: { "chatRequests.sent": currentUser._id },
      })

      return NextResponse.json({
        success: true,
        message: "Chat request rejected",
      })
    }
  } catch (error) {
    console.error("Respond to chat request error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
