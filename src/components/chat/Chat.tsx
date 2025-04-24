import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2, Loader2, Copy, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAIResponse } from '@/lib/aiResponse'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Message, Note } from "@/lib/types"

interface ChatProps {
  isOpen: boolean
  noteToSummarize?: Note | null
  onCreateNote?: (content: string) => void
}

const DEFAULT_AI_ERROR = 'Looks like neuro AI is not working right now, please try again later!'

export function Chat({ isOpen, noteToSummarize, onCreateNote }: ChatProps) {
  const supabase = createClientComponentClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (noteToSummarize) {
      const summarizeNote = async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: "summarize this note",
          sender: 'user',
          timestamp: Date.now()
        }

        const loadingMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "neuro AI is thinking...",
          sender: 'ai',
          timestamp: Date.now(),
          isLoading: true
        }

        setMessages(prev => [...prev, userMessage, loadingMessage])
        setIsLoading(true)

        try {
          const aiPrompt = `Please summarize this note in a concise way:\n\n${noteToSummarize.content}`
          const aiResponse = await getAIResponse(aiPrompt)
          
          setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: aiResponse,
            sender: 'ai',
            timestamp: Date.now()
          }
          setMessages(prev => [...prev, aiMessage])
        } catch (error) {
          setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            content: error instanceof Error ? error.message : DEFAULT_AI_ERROR,
            sender: 'ai',
            timestamp: Date.now()
          }
          setMessages(prev => [...prev, errorMessage])
        } finally {
          setIsLoading(false)
        }
      }

      summarizeNote()
    }
  }, [noteToSummarize])

  const fetchRecentNotes = async (): Promise<Note[]> => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching notes:', error)
      throw new Error('Failed to fetch recent notes')
    }

    return data as Note[]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: Date.now()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "neuro AI is thinking...",
      sender: 'ai',
      timestamp: Date.now(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(userMessage.content)
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: error instanceof Error ? error.message : DEFAULT_AI_ERROR,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionClick = async (option: string) => {
    if (isLoading) return
    if (option.includes('help me write')) {
      setInputValue('I want to write a short note about...')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: option,
      sender: 'user',
      timestamp: Date.now()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "neuro AI is thinking...",
      sender: 'ai',
      timestamp: Date.now(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setIsLoading(true)

    try {
      let aiPrompt = option

      if (option.includes('summarize')) {
        const recentNotes = await fetchRecentNotes()
        if (recentNotes.length === 0) {
          throw new Error('No notes found to summarize')
        }
        
        const notesText = recentNotes
          .map((note, index) => `Note ${index + 1}:\n${note.content}`)
          .join('\n\n')
        
        aiPrompt = `Please summarize these notes in a concise way:\n\n${notesText}`
      }

      const aiResponse = await getAIResponse(aiPrompt)
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: error instanceof Error ? error.message : DEFAULT_AI_ERROR,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
    localStorage.removeItem('chat-messages')
  }

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }

  const handleCreateNote = (content: string) => {
    if (onCreateNote) {
      onCreateNote(content)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 right-4 w-1/4 h-2/3 bg-background border rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">chat with neuro AI</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={messages.length > 0 ? "visible" : "hidden"}
            onClick={clearConversation}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="grid gap-2">
            <Button
              variant="outline"
              className="h-auto p-4"
              onClick={() => handleOptionClick('summarize my recent notes')}
            >
              summarize my recent notes
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4"
              onClick={() => handleOptionClick('help me write a short note')}
            >
              help me write a short note
            </Button>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">{message.content}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <span className="text-xs text-gray-200 text-right block">
                      {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'ai' && !message.isLoading && (
                      <div className="flex justify-between gap-2 mt-2 pt-2 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => handleCopyMessage(message.content)}
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => handleCreateNote(message.content)}
                        >
                          <Plus className="h-3 w-3" />
                          Create Note
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="type a message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
} 