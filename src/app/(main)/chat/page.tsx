import { ChatList } from "@/src/components/chat-list"
import { Card } from "@/src/components/ui/card"

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <ChatList />
      </Card>
    </div>
  )
}
