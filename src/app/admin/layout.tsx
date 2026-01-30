import type React from "react"
import { AdminNav } from "@/components/admin-nav"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.isAdmin) {
    redirect("/feed")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="pt-16">{children}</main>
    </div>
  )
}
