export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
}

export interface UpdateTaskRequest {
  title?: string
  completed?: boolean
}

export interface TaskStats {
  total: number
  completed: number
  pending: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  message: string
  errors?: string[]
}
