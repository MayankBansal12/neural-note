import { TypewriterEffect } from "./ui/typewriter-effect";

export function Landing() {
    return (
        <div className="flex-1 bg-background p-8 lg:p-16 overflow-y-auto flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center flex flex-col items-center justify-center gap-6">
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
    )
}