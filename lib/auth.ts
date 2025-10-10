import { cookies } from "next/headers"
import { verifyAccessToken } from "./jwt"
import { connectDB } from "./mongoose"
import User from "./models/User"
import type { User as UserType } from "./types"

export async function getCurrentUser(): Promise<UserType | null> {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get("access-token")?.value

    if (!token) return null

    const decoded = verifyAccessToken(token)
    if (!decoded) return null

    const user = await User.findById(decoded.userId).lean()

    if (!user) return null

    return {
      ...user,
      _id: user._id.toString(),
    } as UserType
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}
