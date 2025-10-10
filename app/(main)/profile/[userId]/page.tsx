import { notFound } from "next/navigation"
import { connectDB } from "@/lib/mongoose"
import User from "@/lib/models/User"
import Post from "@/lib/models/Post"
import { getCurrentUser } from "@/lib/auth"
import { ProfileHeader } from "@/components/profile-header"
import type { User as UserType } from "@/lib/types"

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const currentUser = await getCurrentUser()

  try {
    await connectDB()

    const user = await User.findById(userId).select("-password").lean() as UserType | null

    if (!user) {
      notFound()
    }

    const postsCount = await Post.countDocuments({ userId })

    const userData = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      bio: user.bio || "",
      avatar: user.avatar || "",
      coverImage: user.coverImage || "",
      isVerified: user.isVerified || false,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      postsCount,
      followers: user.followers || [],
    }

    const isOwnProfile = currentUser?._id === userId

    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <ProfileHeader user={userData} currentUserId={currentUser?._id} isOwnProfile={isOwnProfile} />

        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <p className="text-muted-foreground text-center py-8">No posts yet</p>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Profile page error:", error)
    notFound()
  }
}
