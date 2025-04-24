import { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "neuro Note - AI-Powered Note Taking",
  description: "Take smarter notes with AI assistance",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Marketing Section */}
      <div className="flex-1 bg-background p-8 lg:p-16 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">
            neuro Note
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Transform your note-taking experience with AI-powered insights and organization.
          </p>
          
          <div className="mt-12 space-y-8">
            <Feature
              title="AI-Powered Note Taking"
              description="Let AI help you organize, summarize, and enhance your notes automatically."
            />
            <Feature
              title="Smart Organization"
              description="Your notes are automatically categorized and tagged for easy retrieval."
            />
            <Feature
              title="Cross-Platform Sync"
              description="Access your notes from any device, always in sync."
            />
            <Feature
              title="Secure & Private"
              description="Your notes are encrypted and only accessible to you."
            />
          </div>
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

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative">
      <dt className="text-lg font-semibold">
        {title}
      </dt>
      <dd className="mt-2 text-muted-foreground">
        {description}
      </dd>
    </div>
  )
}
