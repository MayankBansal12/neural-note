export interface Note {
  id: string
  content: string
  created_at: string
  updated_at: string
}

export type SortOrder = "desc" | "asc"
export type GridView = "single" | "double"

export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'developer'
  timestamp: number
  isLoading?: boolean
}