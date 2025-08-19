import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 ${className}`}
      {...props}
    />
  )
}
