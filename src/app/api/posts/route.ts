import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/src/lib/mongoose"
import Post from "@/src/lib/models/Post"
import User from "@/src/lib/models/User"
import { getCurrentUser } from "@/src/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get posts from followed users and own posts
    const posts = await Post.find({
      $or: [{ userId: currentUser._id }, { userId: { $in: currentUser.following } }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    // Get user details for each post
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.userId).select("username fullName avatar").lean()

        return {
          ...post,
          _id: post._id.toString(),
          user: user
            ? {
                _id: user._id.toString(),
                username: user.username,
                fullName: user.fullName,
                avatar: user.avatar,
              }
            : null,
          likesCount: post.likes?.length || 0,
          commentsCount: post.comments?.length || 0,
          isLiked: post.likes?.some((id) => id.toString() === currentUser._id) || false,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      posts: postsWithUsers,
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { content, images } = await request.json()

    if (!content && (!images || images.length === 0)) {
      return NextResponse.json({ success: false, message: "Post content or images required" }, { status: 400 })
    }

    const post = await Post.create({
      userId: currentUser._id,
      content: content || "",
      images: images || [],
      likes: [],
      comments: [],
    })

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      postId: post._id.toString(),
    })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
