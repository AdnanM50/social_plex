import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/src/lib/mongoose"
import User from "@/src/lib/models/User"
import { getCurrentUser } from "@/src/lib/auth"
import { uploadImage } from "@/src/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("cover") as File

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImage(file)

    // Update user's cover image
    await User.findByIdAndUpdate(currentUser._id, { coverImage: imageUrl })

    return NextResponse.json({
      success: true,
      message: "Cover image updated successfully",
      coverImage: imageUrl,
    })
  } catch (error) {
    console.error("Upload cover error:", error)
    return NextResponse.json({ success: false, message: "Failed to upload image" }, { status: 500 })
  }
}
