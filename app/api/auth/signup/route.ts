import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import { generateOTP } from "@/lib/jwt"
import type { SignupCredentials } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body: SignupCredentials = await request.json()
    const { username, email, password, fullName } = body

    if (!username || !email || !password || !fullName) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email or username already exists" },
        { status: 400 },
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP
    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user with OTP (not verified yet)
    await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      otp,
      otpExpires,
      isVerified: false,
    })

    // In production, send OTP via email
    // For now, return it in response (REMOVE IN PRODUCTION)
    console.log(`OTP for ${email}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      otp, // REMOVE IN PRODUCTION
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
