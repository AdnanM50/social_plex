import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"
import { connectDB } from "@/src/lib/mongoose"
import User from "@/src/lib/models/User"
import Conversation from "@/src/lib/models/Conversation"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ success: false, message: "Target user ID is required" }, { status: 400 })
    }

    if (targetUserId === currentUser._id.toString()) {
      return NextResponse.json({ success: false, message: "Cannot send request to yourself" }, { status: 400 })
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [currentUser._id, targetUserId] },
    })

    if (existingConversation) {
      return NextResponse.json({ success: false, message: "Conversation already exists" }, { status: 400 })
    }

    // Check if request already sent
    const currentUserDoc = await User.findById(currentUser._id)
    if (currentUserDoc?.chatRequests.sent.includes(targetUserId)) {
      return NextResponse.json({ success: false, message: "Request already sent" }, { status: 400 })
    }

    // Check if request already received
    if (currentUserDoc?.chatRequests.received.includes(targetUserId)) {
      return NextResponse.json({ success: false, message: "Request already received from this user" }, { status: 400 })
    }

    // Add to sent requests for current user
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { "chatRequests.sent": targetUserId },
    })

    // Add to received requests for target user
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { "chatRequests.received": currentUser._id },
    })

    return NextResponse.json({
      success: true,
      message: "Chat request sent successfully",
    })
  } catch (error) {
    console.error("Send chat request error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
