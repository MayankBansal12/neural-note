"use client"

import Link from "next/link"
import { Github, Twitter, LogOut, Mail } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "../theme-toggle"

export function Header() {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <header className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex-1">
                    <Link href="/" className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold">neuronote</h1>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/MayankBansal12/neuro-note"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Github className="h-5 w-5" />
                    </a>

                    <a
                        href="https://twitter.com/SimplerMayank"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Twitter className="h-5 w-5" />
                    </a>

                    <a
                        href="mailto:mayankbansal125+neuronote@gmail.com"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Mail className="h-5 w-5" />
                    </a>

                    <ThemeToggle />

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
} 