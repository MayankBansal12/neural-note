import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"

interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
}

const NOTES_PER_PAGE = 5

export function useFetchNotes(sortOrder: "asc" | "desc" = "desc") {
  const supabase = createClientComponentClient()

  return useInfiniteQuery({
    queryKey: ["notes", sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * NOTES_PER_PAGE
      const to = from + NOTES_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from("notes")
        .select("*", { count: "exact" })
        .order("updated_at", { ascending: sortOrder === "asc" })
        .range(from, to)

      if (error) throw error

      const hasMore = count ? from + NOTES_PER_PAGE < count : false
      return {
        notes: data as Note[],
        nextPage: hasMore ? pageParam + 1 : undefined
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  })
}

export function useFetchNoteById(id: string) {
  const supabase = createClientComponentClient()

  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single()

      if (error) throw error
      return data as Note
    }
  })
}

export function useCreateNote() {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            content,
            user_id: user.id
          }
        ])
        .select()

      if (error) throw error
      return data[0] as Note
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
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
}

export function useUpdateNote() {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("notes")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      queryClient.invalidateQueries({ queryKey: ["note", variables.id] })
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
    }
  })
}

export function useDeleteNote() {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  })
} 