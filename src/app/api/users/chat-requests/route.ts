import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"
import { connectDB } from "@/src/lib/mongoose"
import User from "@/src/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(currentUser._id)
      .populate("chatRequests.sent", "username fullName avatar")
      .populate("chatRequests.received", "username fullName avatar")

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      chatRequests: {
        sent: user.chatRequests.sent,
        received: user.chatRequests.received,
      },
    })
  } catch (error) {
    console.error("Get chat requests error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
