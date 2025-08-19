"use client"

import { useState, useEffect } from "react"
import { taskApi } from "../services/api"
import type { Task, CreateTaskRequest, UpdateTaskRequest, TaskStats } from "../types/task"

export interface UseTasksReturn {
  tasks: Task[]
  stats: TaskStats
  loading: boolean
  error: string | null
  addTask: (taskData: CreateTaskRequest) => Promise<void>
  updateTask: (id: string, taskData: UpdateTaskRequest) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  refreshTasks: () => Promise<void>
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    refreshTasks()
  }, [])

  const refreshTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await taskApi.getAllTasks()

      const data = (response && typeof response === "object" && "data" in response)
        ? (response as { data: { tasks: Task[]; stats: TaskStats } }).data
        : response
      setTasks(data.tasks ?? [])
      setStats(data.stats ?? { total: 0, completed: 0, pending: 0 })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
      setTasks([])
      setStats({ total: 0, completed: 0, pending: 0 })
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData: CreateTaskRequest) => {
    try {
      setError(null)

      if (typeof taskData === "string") {
        taskData = { title: taskData } as CreateTaskRequest
      }

      const newTask = await taskApi.createTask(taskData)
      setTasks((prev) => [...prev, newTask])
      setStats((prev) => ({
        total: prev.total + 1,
        completed: prev.completed + (newTask.completed ? 1 : 0),
        pending: prev.pending + (newTask.completed ? 0 : 1),
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add task")
      throw err
    }
  }

  const updateTask = async (id: string, taskData: UpdateTaskRequest) => {
    try {
      setError(null)
      const updatedTask = await taskApi.updateTask(id, taskData)

      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))

      setStats((prev) => {
        const wasCompleted = tasks.find((t) => t.id === id)?.completed ?? false
        const nowCompleted = updatedTask.completed

        return {
          total: prev.total,
          completed: prev.completed + (nowCompleted && !wasCompleted ? 1 : 0) - (!nowCompleted && wasCompleted ? 1 : 0),
          pending: prev.pending + (!nowCompleted && wasCompleted ? 1 : 0) - (nowCompleted && !wasCompleted ? 1 : 0),
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task")
      throw err
    }
  }


  const deleteTask = async (id: string) => {
    try {
      setError(null)
      await taskApi.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      await refreshTasks()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task")
      throw err
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      await updateTask(id, { completed: !task.completed })
    }
  }

  return {
    tasks,
    stats,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refreshTasks,
  }
}
