"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Post {
  _id: string
  content: string
  images?: string[]
  user: {
    _id: string
    username: string
    fullName: string
    avatar?: string
  }
  likesCount: number
  commentsCount: number
  isLiked: boolean
  createdAt: Date
  comments?: Array<{
    _id: string
    userId: string
    content: string
    createdAt: Date
  }>
}

export function PostCard({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState(initialPost)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setPost({
          ...post,
          isLiked: data.isLiked,
          likesCount: data.isLiked ? post.likesCount + 1 : post.likesCount - 1,
        })
      }
    } catch (error) {
      console.error("Like error:", error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      })

      const data = await response.json()

      if (data.success) {
        setPost({
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...(post.comments || []), data.comment],
        })
        setComment("")
      }
    } catch (error) {
      console.error("Comment error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center gap-3 p-4">
        <Link href={`/profile/${post.user._id}`}>
          <Avatar>
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.fullName} />
            <AvatarFallback>{post.user.fullName[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${post.user._id}`}>
            <h3 className="font-semibold hover:underline">{post.user.fullName}</h3>
          </Link>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      {post.content && <div className="px-4 pb-3 leading-relaxed">{post.content}</div>}

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="relative w-full aspect-square bg-muted">
          <Image src={post.images[0] || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{post.likesCount} likes</span>
          <span>{post.commentsCount} comments</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 gap-2 ${post.isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
            Like
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="w-5 h-5" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 gap-2">
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-3 pt-3 border-t border-border">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted rounded-lg p-2">
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleComment} className="flex gap-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                disabled={loading}
              />
              <Button type="submit" size="sm" disabled={loading || !comment.trim()}>
                Post
              </Button>
            </form>
          </div>
        )}
      </div>
    </Card>
  )
}
