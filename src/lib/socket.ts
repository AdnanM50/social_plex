"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000"
    
    socket = io(socketUrl, {
      path: '/api/socket',
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
