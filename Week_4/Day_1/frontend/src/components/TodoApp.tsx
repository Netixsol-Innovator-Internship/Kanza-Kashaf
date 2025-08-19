"use client"

import type React from "react"
import { useTasks } from "../hooks/useTasks"
import { AddTaskForm } from "./AddTaskForm"
import { TaskItem } from "./TaskItem"
import { TaskStats } from "./TaskStats"
import { ThemeToggle } from "./ThemeToggle"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import { CheckCircle2, Plus } from "lucide-react"

const TodoApp: React.FC = () => {
  const { tasks, stats, loading, error, addTask, deleteTask, toggleTask } = useTasks()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
      <div className="max-w-4xl min-h-screen mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Stay organized, stay productive</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <TaskStats stats={stats} />
        </div>

        <div className="mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-card-foreground">Add New Task</h2>
            </div>
            <AddTaskForm onAddTask={addTask} />
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-muted/30 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No tasks yet</h3>
                <p className="text-muted-foreground">
                  Create your first task above to get started on your productivity journey!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </div>
      </div>
  )
}

export default TodoApp
