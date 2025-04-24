"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

const MAX_CHARS = 500

interface CreateNoteProps {
  initialContent?: string
  onContentChange?: (content: string) => void
}

export function CreateNote({ initialContent = "", onContentChange }: CreateNoteProps) {
  const [content, setContent] = useState(initialContent)
  const [isExpanded, setIsExpanded] = useState(false)
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent)
      setIsExpanded(true)
    }
  }, [initialContent])

  const createNoteMutation = useMutation({
    mutationFn: async (noteContent: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            content: noteContent.slice(0, MAX_CHARS),
            user_id: user.id
          }
        ])
        .select()

      if (error) {
        console.error("Error creating note:", error)
        throw error
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      setContent("")
      setIsExpanded(false)
      if (onContentChange) {
        onContentChange("")
      }
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      })
    },
    onError: (error) => {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isOverLimit) {
      createNoteMutation.mutate(content)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    if (onContentChange) {
      onContentChange(newContent)
    }
  }

  const charsCount = content.length
  const isOverLimit = charsCount > MAX_CHARS

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="what's up on your mind? just write..."
          onFocus={() => setIsExpanded(true)}
          onBlur={() => !content && setIsExpanded(false)}
          className={`resize-none transition-all transform duration-300 rounded-2xl bg-card ${
            isExpanded ? "h-32" : "h-16"
          } ${isOverLimit ? "text-destructive" : ""}`}
        />
      </div>
      <Button
        type="submit"
        className="absolute left-1/2 -translate-x-1/2 bottom-1 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!content.trim() || createNoteMutation.isPending || isOverLimit}
      >
        {createNoteMutation.isPending ? (
          <span className="animate-spin"></span>
        ) : (
          <Plus className="h-5 w-5" />
        )}
      </Button>
      <div className="text-right mt-1">
        <span className={`text-sm ${
          isOverLimit ? "text-destructive" : "text-muted-foreground"
        }`}>
          {charsCount}/{MAX_CHARS}
        </span>
      </div>
    </form>
  )
} 