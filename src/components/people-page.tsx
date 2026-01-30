"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, UserPlus, Check, X, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  username: string
  fullName: string
  avatar?: string
  bio?: string
  isVerified?: boolean
}

interface ChatRequests {
  sent: User[]
  received: User[]
}

export function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [chatRequests, setChatRequests] = useState<ChatRequests>({ sent: [], received: [] })
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchChatRequests()
  }, [])

  const fetchChatRequests = async () => {
    try {
      const response = await fetch("/api/users/chat-requests")
      const data = await response.json()

      if (data.success) {
        setChatRequests(data.chatRequests)
      }
    } catch (error) {
      console.error("Fetch chat requests error:", error)
    }
  }

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        console.log("Search results:", data.users)
        setSearchResults(data.users)
      } else {
        console.error("Search error:", data.message)
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Search users error:", error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      })
    } finally {
      setSearchLoading(false)
    }
  }

  const sendChatRequest = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/users/chat-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetUserId: userId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Chat request sent successfully",
        })
        fetchChatRequests()
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Send chat request error:", error)
      toast({
        title: "Error",
        description: "Failed to send chat request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (requesterId: string, action: "accept" | "reject") => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  const isRequestSent = (userId: string) => {
    return chatRequests.sent.some((user) => user._id === userId)
  }

  const isRequestReceived = (userId: string) => {
    return chatRequests.received.some((user) => user._id === userId)
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search People</TabsTrigger>
          <TabsTrigger value="sent">
            Sent Requests
            {chatRequests.sent.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {chatRequests.sent.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="received">
            Received Requests
            {chatRequests.received.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {chatRequests.received.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchUsers(e.target.value)
              }}
              className="pl-10"
            />
          </div>

          {searchLoading && (
            <div className="text-center text-muted-foreground">Searching...</div>
          )}

          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.fullName}</h3>
                            {user.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          {user.bio && <p className="text-sm text-muted-foreground mt-1">{user.bio}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isRequestSent(user._id) ? (
                          <Button variant="outline" disabled>
                            <Check className="w-4 h-4 mr-2" />
                            Request Sent
                          </Button>
                        ) : isRequestReceived(user._id) ? (
                          <Button variant="outline" disabled>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Request Received
                          </Button>
                        ) : (
                          <Button
                            onClick={() => sendChatRequest(user._id)}
                            disabled={loading}
                            size="sm"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Send Request
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
            <div className="text-center text-muted-foreground">No users found</div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {chatRequests.sent.length === 0 ? (
            <div className="text-center text-muted-foreground">No sent requests</div>
          ) : (
            <div className="space-y-2">
              {chatRequests.sent.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {chatRequests.received.length === 0 ? (
            <div className="text-center text-muted-foreground">No received requests</div>
          ) : (
            <div className="space-y-2">
              {chatRequests.received.map((user) => (
                <Card key={user._id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
                          <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => respondToRequest(user._id, "accept")}
                          disabled={loading}
                          size="sm"
                          variant="default"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => respondToRequest(user._id, "reject")}
                          disabled={loading}
                          size="sm"
                          variant="outline"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
