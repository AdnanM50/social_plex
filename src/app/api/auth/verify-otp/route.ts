import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt"
import type { OTPVerification } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body: OTPVerification = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 })
    }

    // Find user with matching OTP
    const user = await User.findOne({ email, otp })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 })
    }

    // Check if OTP is expired
    if (user.otpExpires && user.otpExpires < new Date()) {
      return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 })
    }

    // Mark user as verified and clear OTP
    user.isVerified = true
    user.otp = undefined
    user.otpExpires = undefined
    await user.save()

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    // Set cookies
    const response = NextResponse.json({
      success: true,
      message: "Account verified successfully",
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullName: user.fullName,
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
    console.error("OTP verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
