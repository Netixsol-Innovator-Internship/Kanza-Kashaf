"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Plus } from "lucide-react"
import type { CreateTaskRequest } from "../types/task"

interface AddTaskFormProps {
  onAddTask: (taskData: CreateTaskRequest) => Promise<void>
  isLoading?: boolean
}

export function AddTaskForm({ onAddTask, isLoading }: AddTaskFormProps) {
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    try {
      setSubmitting(true)
      setError("")
      await onAddTask({ title: title.trim() })
      setTitle("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (error) setError("")
            }}
            className={`h-12 text-base placeholder:text-muted-foreground/60 border-2 focus:border-primary/50 transition-all duration-200 ${
              error ? "border-destructive focus:border-destructive" : ""
            }`}
            disabled={isLoading || submitting}
          />
          {error && <p className="text-sm text-destructive mt-2 flex items-center gap-1">{error}</p>}
        </div>

        <Button
          type="submit"
          disabled={isLoading || submitting || !title.trim()}
          className="h-12 px-6 font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {submitting ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  )
}
