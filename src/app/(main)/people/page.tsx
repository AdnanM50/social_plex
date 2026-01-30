import { PeoplePage } from "@/src/components/people-page"
import { Card } from "@/src/components/ui/card"

export default function People() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold">Find People</h1>
          <p className="text-muted-foreground">Search for users and start conversations</p>
        </div>
        <PeoplePage />
      </Card>
    </div>
  )
}
