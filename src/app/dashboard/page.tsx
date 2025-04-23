import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Neural Note",
  description: "Manage your notes and AI insights",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Notes
            </p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              AI Insights
            </p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-medium">Recent Notes</h3>
          <p className="text-sm text-muted-foreground mt-2">
            No notes yet. Start by creating your first note!
          </p>
        </div>
      </div>
    </div>
  )
} 