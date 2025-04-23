"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"

const MAX_CHARS = 500

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const supabase = createClientComponentClient()

  // Fetch note data
  const { data: note, isLoading } = useQuery({
    queryKey: ["note", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) throw error
      return data
    },
  })

  // Update content when note data is loaded
  useEffect(() => {
    if (note) {
      setContent(note.content)
    }
  }, [note])

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      const { error } = await supabase
        .from("notes")
        .update({ content: noteContent, updated_at: new Date().toISOString() })
        .eq("id", params.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Note updated",
        description: "Your changes have been saved.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", params.id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      })
      router.push("/notes")
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleSave = () => {
    if (content.trim() && !isOverLimit) {
      updateNoteMutation.mutate(content)
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate()
    }
  }

  const charsCount = content.length
  const isOverLimit = charsCount > MAX_CHARS

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => router.push("/notes")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          back to notes
        </Button>
      </div>

      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[200px] resize-none rounded-2xl bg-card ${
            isOverLimit ? "text-destructive" : ""
          }`}
        />
        
        <div className="flex justify-between items-center">
          <div className={`text-sm ${
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          }`}>
            {charsCount}/{MAX_CHARS}
          </div>
          
          <div className="space-x-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteNoteMutation.isPending}
            >
              Delete
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateNoteMutation.isPending || isOverLimit || !content.trim()}
            >
              Save
            </Button>
          </div>
        </div>

        {note && (
          <div className="text-sm text-muted-foreground">
            <p>first created {new Date(note.created_at).toLocaleString()}</p>
            <p>last updated {new Date(note.updated_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
} 