const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!
const DEFAULT_SYSTEM_PROMPT = "i want you to act as an AI assistant helping in writing and summarizing notes, nothing else! only answer to user's query that are based on notes and avoid any other conversation. if user ask to write a note, make the note short and in less than 500 chars"

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "microsoft/mai-ds-r1:free",
        messages: [
          {
            content: DEFAULT_SYSTEM_PROMPT,
            role: "developer"
          },
          {
            content: message,
            role: "user"
          }
        ]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get AI response')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error('Error calling OpenRouter API:', error)
    throw new Error('Failed to get AI response. Please try again.')
  }
}
