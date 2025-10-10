import { notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ChatWindow } from "@/components/chat-window"
import { Card } from "@/components/ui/card"

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser || !ObjectId.isValid(conversationId)) {
    notFound()
  }

  const client = await clientPromise
  const db = client.db("social-chat-app")

  const conversation = await db.collection("conversations").findOne({
    _id: new ObjectId(conversationId),
    participants: currentUser._id,
  })

  if (!conversation) {
    notFound()
  }

  const otherUserId = conversation.participants.find((id: string) => id !== currentUser._id)
  const otherUser = await db.collection("users").findOne(
    { _id: new ObjectId(otherUserId) },
    {
      projection: { username: 1, fullName: 1, avatar: 1 },
    },
  )

  if (!otherUser) {
    notFound()
  }

  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <Card className="h-full overflow-hidden">
        <ChatWindow
          conversationId={conversationId}
          currentUserId={currentUser._id}
          otherUser={{
            _id: otherUser._id.toString(),
            fullName: otherUser.fullName,
            avatar: otherUser.avatar,
          }}
        />
      </Card>
    </div>
  )
}
