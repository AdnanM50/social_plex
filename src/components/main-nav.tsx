"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, Settings, Bell, Shield, User, Users } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { useEffect, useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()

      if (data.success) {
        setCurrentUserId(data.user._id)
        if (data.user.isAdmin) {
          setIsAdmin(true)
        }
      }
    } catch (error) {
      console.error("Check admin error:", error)
    }
  }

  const links = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/people", label: "People", icon: Users },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  // Add profile link if we have the current user ID
  if (currentUserId) {
    links.splice(3, 0, { href: `/profile/${currentUserId}`, label: "Profile", icon: User })
  }

  if (isAdmin) {
    links.push({ href: "/admin", label: "Admin", icon: Shield })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/feed" className="text-xl font-bold text-primary">
            SocialChat
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Button key={link.href} variant={isActive ? "default" : "ghost"} size="sm" className="gap-2" asChild>
                  <Link href={link.href}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
