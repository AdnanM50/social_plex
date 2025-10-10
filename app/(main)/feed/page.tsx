"use client"

import { useEffect, useState } from "react"
import { CreatePost } from "@/components/create-post"
import { PostCard } from "@/components/post-card"
import { StoriesBar } from "@/components/stories-bar"

export default function FeedPage() {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
    fetchPosts()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      }
    } catch (error) {
      console.error("Fetch user error:", error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      const data = await response.json()

      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Fetch posts error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-muted-foreground">Loading feed...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <StoriesBar />

      {user && <CreatePost user={user} onPostCreated={fetchPosts} />}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No posts yet. Start following people to see their posts!
          </p>
        ) : (
          posts.map((post: any) => <PostCard key={post._id} post={post} />)
        )}
      </div>
    </div>
  )
}
