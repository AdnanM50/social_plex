import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/src/lib/mongoose"
import User from "@/src/lib/models/User"
import Post from "@/src/lib/models/Post"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB()

    const { userId } = await params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 })
    }

    const user = await User.findById(userId).select("-password").lean()

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ userId })

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
        postsCount,
        followersCount: user.followers?.length || 0,
        followingCount: user.following?.length || 0,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
