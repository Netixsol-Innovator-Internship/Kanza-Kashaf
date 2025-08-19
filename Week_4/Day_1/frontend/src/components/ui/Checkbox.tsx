"use client"

import { Check } from "lucide-react"

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Checkbox({ checked, onCheckedChange, disabled, className = "" }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-5 w-5 items-center justify-center rounded border-2 transition-all duration-200
        ${
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "border-border hover:border-primary/50 bg-background"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${className}
      `}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
}
