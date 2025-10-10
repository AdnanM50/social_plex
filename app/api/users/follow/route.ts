import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import { getCurrentUser } from "@/lib/auth"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    if (userId === currentUser._id) {
      return NextResponse.json({ success: false, message: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if already following
    const user = await User.findById(currentUser._id)
    const isFollowing = user?.following.some((id) => id.toString() === userId)

    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(currentUser._id, { $pull: { following: userId } })
      await User.findByIdAndUpdate(userId, { $pull: { followers: currentUser._id } })

      return NextResponse.json({
        success: true,
        message: "Unfollowed successfully",
        isFollowing: false,
      })
    } else {
      // Follow
      await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: userId } })
      await User.findByIdAndUpdate(userId, { $addToSet: { followers: currentUser._id } })

      return NextResponse.json({
        success: true,
        message: "Followed successfully",
        isFollowing: true,
      })
    }
  } catch (error) {
    console.error("Follow/unfollow error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
