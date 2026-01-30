import { Card } from "@/src/components/ui/card"

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-muted-foreground text-center py-8">No notifications yet</p>
      </Card>
    </div>
  )
}
