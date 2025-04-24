"use client"

import { useEffect, useState, useRef, useCallback, Suspense } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useSearchParams, useRouter } from "next/navigation"
import { CreateNote } from "@/components/notes/create-note"
import { Shimmer } from "@/components/ui/shimmer"
import { ArrowUpDown, Grid, LayoutList } from "lucide-react"
import { NotePopover } from "@/components/notes/note-popover"
import { formatDate } from "@/lib/format"
import { ChatButton } from "@/components/chat/ChatButton"
import { Chat } from "@/components/chat/Chat"
import { useFetchNotes } from "@/hooks/useNotes"
import { Note, SortOrder, GridView } from "@/lib/types"
import { Header } from "@/components/layout/header"

function NotesContent() {
  const supabase = createClientComponentClient()
  const [greeting, setGreeting] = useState("")
  const [firstName, setFirstName] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [noteToSummarize, setNoteToSummarize] = useState<Note | null>(null)
  const [newNoteContent, setNewNoteContent] = useState("")

  const sortOrder = (searchParams.get("sort") as SortOrder) || "desc"
  const gridView = (searchParams.get("view") as GridView) || "double"
  const selectedNoteId = searchParams.get("note")

  const updateUrlParams = (params: { sort?: SortOrder; view?: GridView; note?: string | null }) => {
    const newParams = new URLSearchParams(searchParams)
    if (params.sort) newParams.set("sort", params.sort)
    if (params.view) newParams.set("view", params.view)
    if (params.note) {
      newParams.set("note", params.note)
    } else if (params.note === null) {
      newParams.delete("note")
    }
    router.push(`?${newParams.toString()}`)
  }

  const observerTarget = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const getGreeting = () => {
      const hour = currentTime.getHours()
      if (hour < 12) return "Good Morning"
      if (hour < 18) return "Good Afternoon"
      return "Good Evening"
    }

    setGreeting(getGreeting())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [currentTime])

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useFetchNotes(sortOrder)

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  const allNotes = data?.pages.flatMap(page => page.notes) || []

  const handleNoteClick = (noteId: string) => {
    updateUrlParams({ note: noteId })
  }

  const handleClosePopover = () => {
    updateUrlParams({ note: null })
  }

  const handleSummarizeNote = async () => {
    if (noteToSummarize) {
      setIsChatOpen(true)
      setNoteToSummarize(null)
    }
  }

  useEffect(() => {
    if (noteToSummarize) {
      handleSummarizeNote()
    }
  }, [noteToSummarize, handleSummarizeNote])

  return (
    <div className="min-h-screen bg-background">
      <Header />

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

        <div className="pb-6">
          <CreateNote 
            initialContent={newNoteContent}
            onContentChange={setNewNoteContent}
          />
        </div>

        {!isLoading && allNotes.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Don&apos;t have any notes yet? Create one!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Notes</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const newSort = sortOrder === "desc" ? "asc" : "desc"
                    updateUrlParams({ sort: newSort })
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sort by date
                  <ArrowUpDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const newView = gridView === "single" ? "double" : "single"
                    updateUrlParams({ view: newView })
                  }}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {gridView === "single" ? (
                    <Grid className="h-4 w-4" />
                  ) : (
                    <LayoutList className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className={`grid gap-4 ${gridView === "double" ? "md:grid-cols-2" : "grid-cols-1"}`}>
              {isLoading ? (
                <>
                  <Shimmer className="h-24 rounded-2xl" />
                  <Shimmer className="h-24 rounded-2xl" />
                  <Shimmer className="h-24 rounded-2xl" />
                </>
              ) : (
                <>
                  {allNotes.map((note: Note) => (
                    <div
                      key={note.id}
                      className="rounded-2xl border bg-card p-4 overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleNoteClick(note.id)}
                    >
                      <p className="whitespace-pre-wrap break-words line-clamp-[8] text-sm">
                        {note.content}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        on {formatDate(note.updated_at)}
                      </p>
                    </div>
                  ))}

                  <div ref={observerTarget} className="h-4" />
                  {isFetchingNextPage && (
                    <>
                      <Shimmer className="h-24 rounded-2xl" />
                      {gridView === "double" && <Shimmer className="h-24 rounded-2xl" />}
                    </>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {selectedNoteId && (
          <NotePopover
            id={selectedNoteId}
            isOpen={true}
            onClose={handleClosePopover}
            onSummarize={async () => {
              const { data: note } = await supabase
                .from("notes")
                .select("*")
                .eq("id", selectedNoteId)
                .single()
              
              if (note) {
                setNoteToSummarize(note)
              }
            }}
          />
        )}
      </main>

      <ChatButton onClick={() => setIsChatOpen(!isChatOpen)} />
      <Chat 
        isOpen={isChatOpen} 
        noteToSummarize={noteToSummarize}
        onCreateNote={(content: string) => {
          setNewNoteContent(content)
          setIsChatOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </div>
  )
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesContent />
    </Suspense>
  )
} 