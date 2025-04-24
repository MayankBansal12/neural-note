import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Trash2 } from "lucide-react"
import { getAIResponse } from '@/lib/aiResponse'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: number
}

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_AI_ERROR = 'Looks like neural AI is not working right now, please try again later!'

export function Chat({ isOpen, onClose }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(userMessage.content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
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

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(option)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
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

  if (!isOpen) return null

  return (
    <div className="fixed bottom-20 right-4 w-1/4 h-2/3 bg-background border rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">chat with neural AI</h3>
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
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <span className="text-xs text-gray-500 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
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