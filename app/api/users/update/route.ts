import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import { getCurrentUser } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { fullName, bio, username } = body

    // Check if username is taken by another user
    if (username && username !== currentUser.username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: currentUser._id },
      })

      if (existingUser) {
        return NextResponse.json({ success: false, message: "Username already taken" }, { status: 400 })
      }
    }

    // Update user
    const updateData: any = {}

    if (fullName) updateData.fullName = fullName
    if (bio !== undefined) updateData.bio = bio
    if (username) updateData.username = username

    await User.findByIdAndUpdate(currentUser._id, updateData)

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
