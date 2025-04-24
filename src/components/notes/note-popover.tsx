import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFetchNoteById, useUpdateNote, useDeleteNote } from "@/hooks/useNotes"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Shimmer } from "../ui/shimmer"
import { formatDate } from "@/lib/format"
import { FileText } from "lucide-react"

const MAX_CHARS = 500

interface NotePopoverProps {
  id: string
  isOpen: boolean
  onClose: () => void
  onSummarize?: () => void
}

export function NotePopover({ id, isOpen, onClose, onSummarize }: NotePopoverProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  
  const { data: note, isLoading } = useFetchNoteById(id)
  const updateNoteMutation = useUpdateNote()
  const deleteNoteMutation = useDeleteNote()

  useEffect(() => {
    if (note) {
      setContent(note.content)
    }
  }, [note])

  const handleSave = () => {
    if (content.trim() && !isOverLimit) {
      updateNoteMutation.mutate({ id, content })
      onClose()
      router.refresh()
    }
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id)
      onClose()
      router.refresh()
    }
  }

  const handleSummarize = () => {
    onClose()
    if (onSummarize) {
      onSummarize()
    }
  }

  const charsCount = content.length
  const isOverLimit = charsCount > MAX_CHARS

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Note</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Shimmer className="h-24 rounded-2xl" />
        ) : (
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
                  variant="outline"
                  onClick={handleSummarize}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Summarize
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteNoteMutation.isPending}
                >
                  Delete
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateNoteMutation.isPending || isOverLimit || !content.trim() || content === note?.content}
                >
                  Save
                </Button>
              </div>
            </div>

            {note && (
              <div className="text-sm text-muted-foreground">
                <p>first created on {formatDate(note.created_at)}</p>
                <p>last updated on {formatDate(note.updated_at)}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
