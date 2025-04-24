import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { Landing } from "@/components/landing"

export const metadata: Metadata = {
  title: "neuro Note - AI-Powered Note Taking",
  description: "Take smarter notes with AI assistance",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      <Landing />

      <div className="flex-1 border-l bg-muted/20 p-8 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
