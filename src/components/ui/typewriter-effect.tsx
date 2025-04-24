"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterEffectProps {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
  typeByLetter?: boolean
}

export function TypewriterEffect({
  words,
  className,
  cursorClassName,
  typeByLetter = false,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const word = words[currentWordIndex]
    const delay = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(word.text.slice(0, currentText.length - 1))
        if (currentText.length === 0) {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        setCurrentText(word.text.slice(0, currentText.length + 1))
        if (currentText.length === word.text.length) {
          if (typeByLetter) {
            // For subheading, we don't want to delete, just move to next word
            setCurrentWordIndex((prev) => (prev + 1) % words.length)
            setCurrentText("")
          } else {
            setTimeout(() => setIsDeleting(true), 2000)
          }
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [currentText, currentWordIndex, isDeleting, words, typeByLetter])

  return (
    <div className={cn("flex items-center", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn(
            word.className,
            index === currentWordIndex && currentText.length > 0
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          {typeByLetter ? currentText : word.text}
        </span>
      ))}
      <span
        className={cn(
          "inline-block w-1 h-6 animate-pulse",
          cursorClassName || "bg-foreground"
        )}
      />
    </div>
  )
} 