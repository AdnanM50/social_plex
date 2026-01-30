import type React from "react"
import { MainNav } from "@/components/main-nav"
import { getCurrentUser } from "@/lib/auth"
import { SocketProvider } from "@/components/socket-provider"
import { redirect } from "next/navigation"

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <SocketProvider userId={user._id}>
      <div className="min-h-screen bg-background">
        <MainNav />
        <main className="pt-16">{children}</main>
      </div>
    </SocketProvider>
  )
}
