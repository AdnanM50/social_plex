"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

interface CreatePostProps {
  user: {
    fullName: string
    avatar?: string
  }
  onPostCreated?: () => void
}

export function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()

      if (data.success) {
        setContent("")
        onPostCreated?.()
      }
    } catch (error) {
      console.error("Create post error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[100px] resize-none"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Photo
          </Button>

          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
