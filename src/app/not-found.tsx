import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Landing } from "@/components/landing"

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col lg:flex-row">
            <Landing />

            <div className="flex-1 border-l bg-muted/20 p-8 lg:p-16 flex items-center justify-center">
                <div className="w-full max-w-sm text-center flex flex-col items-center gap-6">
                    <h2 className="text-6xl font-bold text-primary">404</h2>
                    <h3 className="text-2xl font-semibold">You seem to be lost</h3>
                    <p className="text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </main>
    )
} 