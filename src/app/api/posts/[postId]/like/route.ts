import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import Post from "@/lib/models/Post"

export async function POST(request: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { postId } = await params

    await connectDB()

    const post = await Post.findById(postId)

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 })
    }

    const isLiked = post.likes?.includes(currentUser._id)

    if (isLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: currentUser._id } })

      return NextResponse.json({
        success: true,
        message: "Post unliked",
        isLiked: false,
      })
    } else {
      await Post.findByIdAndUpdate(postId, { $addToSet: { likes: currentUser._id } })

      return NextResponse.json({
        success: true,
        message: "Post liked",
        isLiked: true,
      })
    }
  } catch (error) {
    console.error("Like post error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
