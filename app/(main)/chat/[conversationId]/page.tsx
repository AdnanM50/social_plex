import { notFound } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { connectDB } from "@/lib/mongoose"
import Conversation from "@/lib/models/Conversation"
import User from "@/lib/models/User"
import { ChatWindow } from "@/components/chat-window"
import { Card } from "@/components/ui/card"

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    notFound()
  }

  await connectDB()

  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: currentUser._id,
  })

  if (!conversation) {
    notFound()
  }

  const otherUserId = conversation.participants.find((id: any) => id.toString() !== currentUser._id)
  const otherUser = await User.findById(otherUserId).select("username fullName avatar")

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
