"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface Conversation {
  _id: string
  otherUser: {
    _id: string
    username: string
    fullName: string
    avatar?: string
  } | null
  lastMessage?: {
    content: string
    createdAt: Date
  }
  unreadCount: number
  updatedAt: Date
}

interface ChatRequest {
  _id: string
  username: string
  fullName: string
  avatar?: string
}

export function ChatList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchConversations()
    fetchChatRequests()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("Fetch conversations error:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChatRequests = async () => {
    try {
      const response = await fetch("/api/users/chat-requests")
      const data = await response.json()

      if (data.success) {
        setChatRequests(data.chatRequests.received)
      }
    } catch (error) {
      console.error("Fetch chat requests error:", error)
    }
  }

  const respondToRequest = async (requesterId: string, action: "accept" | "reject") => {
    try {
      const response = await fetch("/api/users/chat-request/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId, action }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })
        fetchChatRequests()
        fetchConversations()
        
        if (action === "accept" && data.conversationId) {
          // Redirect to the new conversation
          router.push(`/chat/${data.conversationId}`)
        }
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Respond to chat request error:", error)
      toast({
        title: "Error",
        description: "Failed to respond to chat request",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>
  }

  return (
    <div className="divide-y divide-border">
      {/* Chat Requests Section */}
      {chatRequests.length > 0 && (
        <div className="p-4 bg-muted/30">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Chat Requests</h3>
          {chatRequests.map((request) => (
            <div key={request._id} className="flex items-center gap-3 p-3 bg-background rounded-lg mb-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.fullName} />
                <AvatarFallback>{request.fullName[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{request.fullName}</h4>
                <p className="text-xs text-muted-foreground">@{request.username}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => respondToRequest(request._id, "accept")}
                  size="sm"
                  variant="default"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={() => respondToRequest(request._id, "reject")}
                  size="sm"
                  variant="outline"
                >
                  <X className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversations Section */}
      {conversations.length === 0 && chatRequests.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
      ) : (
        conversations.map((conv) => (
          <Link
            key={conv._id}
            href={`/chat/${conv._id}`}
            className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={conv.otherUser?.avatar || "/placeholder.svg"} alt={conv.otherUser?.fullName} />
              <AvatarFallback>{conv.otherUser?.fullName?.[0] || "?"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold truncate">{conv.otherUser?.fullName}</h3>
                {conv.lastMessage && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage?.content || "Start a conversation"}
                </p>
                {conv.unreadCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {conv.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
