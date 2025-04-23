import { cn } from "@/lib/utils"

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Shimmer({ className, ...props }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted/50",
        className
      )}
      {...props}
    />
  )
} 