import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatButtonProps {
  onClick: () => void
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-20 h-12 w-12 rounded-full shadow-lg"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  )
} 