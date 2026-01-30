"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ProfileHeaderProps {
  user: {
    _id: string
    username: string
    fullName: string
    bio?: string
    avatar?: string
    coverImage?: string
    isVerified: boolean
    followersCount: number
    followingCount: number
    postsCount: number
    followers: string[]
  }
  currentUserId?: string
  isOwnProfile: boolean
}

export function ProfileHeader({ user, currentUserId, isOwnProfile }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(currentUserId ? user.followers.includes(currentUserId) : false)
  const [loading, setLoading] = useState(false)

  const handleFollow = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      })

      const data = await response.json()
      if (data.success) {
        setIsFollowing(data.isFollowing)
      }
    } catch (error) {
      console.error("Follow error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("cover", file)

    try {
      const response = await fetch("/api/users/upload-cover", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const response = await fetch("/api/users/upload-avatar", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error("Upload error:", error)
    }
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-muted">
        {user.coverImage ? (
          <Image src={user.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        {isOwnProfile && (
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <Button size="sm" variant="secondary" className="gap-2" asChild>
              <span>
                <Camera className="w-4 h-4" />
                Edit Cover
              </span>
            </Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20 mb-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-card">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
              <AvatarFallback className="text-3xl">{user.fullName[0]}</AvatarFallback>
            </Avatar>
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <Button size="icon" variant="secondary" className="rounded-full" asChild>
                  <span>
                    <Camera className="w-4 h-4" />
                  </span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            )}
          </div>

          <div className="mt-4 md:mt-0">
            {isOwnProfile ? (
              <Button variant="outline">Edit Profile</Button>
            ) : (
              <Button onClick={handleFollow} disabled={loading} variant={isFollowing ? "outline" : "default"}>
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            {user.isVerified && <Badge variant="secondary">Verified</Badge>}
          </div>
          <p className="text-muted-foreground">@{user.username}</p>

          {user.bio && <p className="text-foreground leading-relaxed">{user.bio}</p>}

          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="font-semibold text-foreground">{user.postsCount}</span>{" "}
              <span className="text-muted-foreground">Posts</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{user.followersCount}</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{user.followingCount}</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
