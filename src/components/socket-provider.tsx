"use client"

import type React from "react"

import { useEffect } from "react"
import { connectSocket, disconnectSocket } from "@/lib/socket"

export function SocketProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  useEffect(() => {
    if (userId) {
      connectSocket(userId)
    }

    return () => {
      disconnectSocket()
    }
  }, [userId])

  return <>{children}</>
}
