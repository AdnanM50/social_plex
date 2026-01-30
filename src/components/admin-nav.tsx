"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      const data = await response.json()
      
      if (data.success) {
        // Clear any local state and redirect to login
        router.push("/login")
        // Force a page reload to clear any cached data
        window.location.href = "/login"
      } else {
        console.error("Logout failed:", data.message)
        // Still redirect to login even if logout API fails
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Redirect to login even if there's an error
      router.push("/login")
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="text-xl font-bold text-primary">
            SocialChat Admin
          </Link>

          <div className="flex items-center gap-2">
            <Button 
              variant={pathname === "/admin" ? "default" : "ghost"} 
              size="sm" 
              className="gap-2"
              asChild
            >
              <Link href="/admin">
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </Button>

            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
