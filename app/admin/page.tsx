import { AdminStats } from "@/components/admin-stats"
import { AdminUsersTable } from "@/components/admin-users-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users and view platform statistics</p>
        </div>

        <AdminStats />

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminUsersTable />
          </CardContent>
        </Card>
    </div>
  )
}
