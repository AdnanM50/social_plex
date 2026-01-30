import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  // Delete both access and refresh tokens
  response.cookies.delete("access-token")
  response.cookies.delete("refresh-token")

  return response
}
