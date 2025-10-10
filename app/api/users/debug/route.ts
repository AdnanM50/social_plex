import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    // Temporarily removed authentication for debugging
    // const currentUser = await getCurrentUser()
    // if (!currentUser) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    // }

    // Get all users for debugging
    const allUsers = await User.find({})
      .select("username fullName email isVerified createdAt")
      .sort({ createdAt: -1 })

    console.log(`Total users in database: ${allUsers.length}`)

    return NextResponse.json({
      success: true,
      totalUsers: allUsers.length,
      users: allUsers.map((user) => ({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      })),
    })
  } catch (error) {
    console.error("Debug users error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
