"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, ImageIcon } from "lucide-react"
import { getSocket } from "@/lib/socket"
import { formatDistanceToNow } from "date-fns"

interface Message {
  _id: string
  conversationId: string
  senderId: string
  content: string
  type: "text" | "image" | "file"
  fileUrl?: string
  createdAt: Date
}

interface ChatWindowProps {
  conversationId: string
  currentUserId: string
  otherUser: {
    _id: string
    fullName: string
    avatar?: string
  }
}

export function ChatWindow({ conversationId, currentUserId, otherUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socket = getSocket()

  useEffect(() => {
    fetchMessages()
    setupSocketListeners()

    // Join conversation room
    socket.emit("join-conversation", conversationId)

    return () => {
      socket.off("new-message")
      socket.off("user-typing")
      socket.off("user-stop-typing")
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Fetch messages error:", error)
    } finally {
      setLoading(false)
    }
  }

  const setupSocketListeners = () => {
    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message])
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    socket.emit("send-message", {
      conversationId,
      senderId: currentUserId,
      content: newMessage,
      type: "text",
    })

    setNewMessage("")
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading messages...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Avatar>
          <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.fullName} />
          <AvatarFallback>{otherUser.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherUser.fullName}</h2>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === currentUserId

          return (
            <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-2 max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                {!isOwn && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={otherUser.avatar || "/placeholder.svg"} alt={otherUser.fullName} />
                    <AvatarFallback>{otherUser.fullName[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button type="button" size="icon" variant="ghost">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
