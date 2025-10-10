"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(userId: string) {
  const socket = getSocket()
  if (!socket.connected) {
    socket.connect()
    socket.emit("register", userId)
  }
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect()
  }
}
