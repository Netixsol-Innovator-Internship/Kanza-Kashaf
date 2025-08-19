import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "destructive"
  size?: "default" | "sm" | "lg"
}

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95"

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md",
  }

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-12 px-8 text-base",
  }

  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
}
