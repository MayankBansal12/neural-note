"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { CreateNote } from "@/components/notes/create-note"
import { Shimmer } from "@/components/ui/shimmer"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowUpDown } from "lucide-react"

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
}

type SortOrder = "desc" | "asc"

export default function NotesPage() {
  const supabase = createClientComponentClient()
  const [greeting, setGreeting] = useState("")
  const [firstName, setFirstName] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.user_metadata?.name) {
        const fullName = user.user_metadata.name
        setFirstName(fullName.split(" ")[0])
      }
    }
    fetchProfile()
  }, [supabase])

  // Update greeting based on time of day
  useEffect(() => {
    const getGreeting = () => {
      const hour = currentTime.getHours()
      if (hour < 12) return "Good Morning"
      if (hour < 18) return "Good Afternoon"
      return "Good Evening"
    }

    setGreeting(getGreeting())

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [currentTime])

  // Fetch notes
  const { data: notes, isLoading } = useQuery({
    queryKey: ["notes", sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: sortOrder === "asc" })

      if (error) {
        console.error("Error fetching notes:", error)
        throw error
      }
      return data as Note[]
    }
  })

  const toggleSort = () => {
    setSortOrder(current => current === "desc" ? "asc" : "desc")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">neuralnote</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-3xl mx-auto p-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              {greeting}, {firstName}
            </h2>
            <p className="text-muted-foreground mt-2">
              how are you feeling today? maybe write a note?
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-medium">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Create Note */}
        <div className="pb-6">
          <CreateNote />
        </div>

        {/* Notes List */}
        {!isLoading && notes?.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">no notes currently, why don't you<br />get started by writing how you feel?</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Notes</h3>
              <button
                onClick={toggleSort}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sort by date
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4">
              {isLoading ? (
                <>
                  <Shimmer className="h-24 rounded-2xl" />
                  <Shimmer className="h-24 rounded-2xl" />
                  <Shimmer className="h-24 rounded-2xl" />
                </>
              ) : (
                <div className="grid gap-4">
                  {notes?.map((note) => (
                    <div key={note.id} className="rounded-2xl border bg-card p-4">
                      <p className="whitespace-pre-wrap">{note.content}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        on {formatDate(note.updated_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
} 