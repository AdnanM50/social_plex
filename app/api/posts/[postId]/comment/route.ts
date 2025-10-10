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
    const { content } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: "Comment content required" }, { status: 400 })
    }

    await connectDB()

    const post = await Post.findById(postId)

    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 })
    }

    const comment = {
      userId: currentUser._id,
      content,
      createdAt: new Date(),
    }

    await Post.findByIdAndUpdate(postId, { $push: { comments: comment } })

    return NextResponse.json({
      success: true,
      message: "Comment added",
      comment,
    })
  } catch (error) {
    console.error("Comment post error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
