import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ success: false, message: "Query must be at least 2 characters" }, { status: 400 })
    }

    console.log(`Searching for users with query: "${query}"`)
    console.log(`Current user ID: ${currentUser._id}`)

    // Search users by username (case insensitive)
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: currentUser._id }, // Exclude current user
      // Temporarily show all users (verified and unverified) for testing
    })
      .select("username fullName avatar bio isVerified")
      .limit(10)

    console.log(`Found ${users.length} users matching query`)

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
      })),
    })
  } catch (error) {
    console.error("Search users error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
