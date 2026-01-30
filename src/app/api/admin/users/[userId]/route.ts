import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import Post from "@/lib/models/Post"
import Story from "@/lib/models/Story"
import Message from "@/lib/models/Message"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await params

    await connectDB()

    await User.findByIdAndDelete(userId)
    await Post.deleteMany({ userId })
    await Story.deleteMany({ userId })
    await Message.deleteMany({ senderId: userId })

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await params
    const { isVerified, isAdmin } = await request.json()

    await connectDB()

    const updateData: any = {}
    if (typeof isVerified === "boolean") updateData.isVerified = isVerified
    if (typeof isAdmin === "boolean") updateData.isAdmin = isAdmin

    await User.findByIdAndUpdate(userId, { $set: updateData })

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
