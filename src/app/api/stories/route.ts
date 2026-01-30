import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import Story from "@/lib/models/Story"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const stories = await Story.find({
      $or: [{ userId: currentUser._id }, { userId: { $in: currentUser.following } }],
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username fullName avatar")
      .lean()

    // Group stories by user
    const storiesByUser = new Map()

    for (const story of stories) {
      const userId = story.userId._id.toString()

      if (!storiesByUser.has(userId)) {
        storiesByUser.set(userId, {
          user: {
            _id: story.userId._id.toString(),
            username: story.userId.username,
            fullName: story.userId.fullName,
            avatar: story.userId.avatar,
          },
          stories: [],
        })
      }

      storiesByUser.get(userId).stories.push({
        ...story,
        _id: story._id.toString(),
        userId: userId,
        hasViewed: story.views?.includes(currentUser._id) || false,
      })
    }

    return NextResponse.json({
      success: true,
      stories: Array.from(storiesByUser.values()),
    })
  } catch (error) {
    console.error("Get stories error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { image, caption } = await request.json()

    if (!image) {
      return NextResponse.json({ success: false, message: "Story image required" }, { status: 400 })
    }

    await connectDB()

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const story = await Story.create({
      userId: currentUser._id,
      image,
      caption: caption || "",
      views: [],
      expiresAt,
    })

    return NextResponse.json({
      success: true,
      message: "Story created successfully",
      storyId: story._id.toString(),
    })
  } catch (error) {
    console.error("Create story error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
