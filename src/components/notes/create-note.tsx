"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

export function CreateNote() {
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { mutate: createNote, isPending } = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("notes")
        .insert([{ 
          content,
          user_id: user.id 
        }])

      if (error) {
        console.error("Error creating note:", error)
        throw error
      }
    },
    onSuccess: () => {
      setContent("")
      setIsExpanded(false)
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create note. Please try again.",
      })
      console.error("Error creating note:", error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createNote()
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          placeholder="what's up on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className={`resize-none transition-all duration-200 ${
            isExpanded ? "h-32" : "h-20"
          } rounded-2xl bg-card`}
        />
      </form>
      <button
        onClick={() => {
          if (content.trim()) {
            createNote()
          } else {
            setIsExpanded(!isExpanded)
          }
        }}
        disabled={isPending}
        className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
} 