import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"

export const metadata: Metadata = {
  title: "neuro Note - AI-Powered Note Taking",
  description: "Take smarter notes with AI assistance",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Marketing Section */}
      <div className="flex-1 bg-background p-8 lg:p-16 overflow-y-auto flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center gap-2">
        <h1 className="text-4xl font-bold tracking-tight">neuro note</h1>
          <TypewriterEffect
            words={[
              {
                text: "A simple note taking app with a little twist of AI...",
                className: "text-xl text-muted-foreground",
              },
            ]}
            cursorClassName="bg-primary"
            typeByLetter={true}
          />
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex-1 border-l bg-muted/20 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
