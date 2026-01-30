import { NextResponse } from "next/server"
import { getCurrentUser } from "@/src/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.coverImage,
        followers: user.followers,
        following: user.following,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
