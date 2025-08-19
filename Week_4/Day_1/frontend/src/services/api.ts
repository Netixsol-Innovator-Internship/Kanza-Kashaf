import axios, { type AxiosResponse } from "axios"
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "../types/task"
import { handleApiError } from "../utils/errorHandler"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const taskApi = {
  getAllTasks: async (): Promise<{ tasks: Task[]; stats: { total: number; completed: number; pending: number } }> => {
    try {
      const response: AxiosResponse<any> = await api.get("/api/tasks")

      const tasks: Task[] = Array.isArray(response.data)
        ? response.data
        : response.data.tasks

      if (!Array.isArray(tasks)) {
        throw new Error("Invalid tasks response format")
      }

      const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.completed).length,
        pending: tasks.filter((t) => !t.completed).length,
      }

      return { tasks, stats }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Shortcut: just tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const { tasks } = await taskApi.getAllTasks()
      return tasks
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.post("/api/tasks", taskData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Update a task
  updateTask: async (id: string, taskData: UpdateTaskRequest): Promise<Task> => {
    try {
      const response: AxiosResponse<Task> = await api.put(`/api/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/tasks/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
