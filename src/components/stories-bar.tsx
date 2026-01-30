"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card } from "@/src/components/ui/card"
import { Plus } from "lucide-react"

interface Story {
  user: {
    _id: string
    username: string
    fullName: string
    avatar?: string
  }
  stories: Array<{
    _id: string
    hasViewed: boolean
  }>
}

export function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories")
      const data = await response.json()

      if (data.success) {
        setStories(data.stories)
      }
    } catch (error) {
      console.error("Fetch stories error:", error)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4 overflow-x-auto">
        {/* Add Story */}
        <button className="flex flex-col items-center gap-2 min-w-[80px]">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-card">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs text-center">Your Story</span>
        </button>

        {/* Stories */}
        {stories.map((story) => (
          <button key={story.user._id} className="flex flex-col items-center gap-2 min-w-[80px]">
            <div
              className={`p-0.5 rounded-full ${
                story.stories.some((s) => !s.hasViewed) ? "bg-gradient-to-tr from-primary to-accent" : "bg-muted"
              }`}
            >
              <Avatar className="w-16 h-16 border-2 border-card">
                <AvatarImage src={story.user.avatar || "/placeholder.svg"} alt={story.user.fullName} />
                <AvatarFallback>{story.user.fullName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-center truncate w-full">{story.user.fullName}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
