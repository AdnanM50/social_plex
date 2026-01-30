import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt"
import type { LoginCredentials } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body: LoginCredentials = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    // Set cookies
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    })

    response.cookies.set("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    })

    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
