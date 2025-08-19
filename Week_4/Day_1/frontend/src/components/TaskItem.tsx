"use client"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Checkbox } from "./ui/Checkbox"
import { Card } from "./ui/Card"
import { Trash2, Calendar } from "lucide-react"
import type { Task } from "../types/task"

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isLoading?: boolean
}

export function TaskItem({ task, onToggle, onDelete, isLoading }: TaskItemProps) {
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async () => {
    try {
      setToggling(true)
      await onToggle(task.id)
    } catch (err) {
      console.error("Failed to toggle task:", err)
    } finally {
      setToggling(false)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await onDelete(task.id)
    } catch (err) {
      console.error("Failed to delete task:", err)
      setDeleting(false)
    }
  }

  return (
    <Card className="group p-4 sm:p-6 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            disabled={isLoading || toggling || deleting}
            className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span
            className={`block text-sm sm:text-base font-medium transition-all duration-200 ${
              task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
            }`}
          >
            {task.title}
          </span>
          {task.createdAt && (
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading || toggling || deleting}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
