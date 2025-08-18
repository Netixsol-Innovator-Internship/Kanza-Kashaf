import axios from "axios"

const API_BASE_URL = "https://kanzaweek3day3backendtask.vercel.app/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const tokenManager = {
  getToken: () => localStorage.getItem("token"),
  setToken: (token) => {
    localStorage.removeItem("token")
    localStorage.setItem("token", token)
  },
  clearToken: () => {
    localStorage.removeItem("token")
  },
  isTokenValid: () => {
    const token = localStorage.getItem("token")
    if (!token) return false

    try {
      // Basic token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  },
}

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = tokenManager.getToken()
  if (token && tokenManager.isTokenValid()) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (token && !tokenManager.isTokenValid()) {
    tokenManager.clearToken()
  }
  return config
})

// Handle token expiration and authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenManager.clearToken()
      if (window.location.pathname !== "/") {
        window.location.href = "/"
      }
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  login: async (credentials) => {
    tokenManager.clearToken()
    const response = await api.post("/users/login", credentials)
    if (response.data?.token) {
      tokenManager.setToken(response.data.token)
    }

    return response
  },
  register: async (userData) => {
    tokenManager.clearToken()
    const response = await api.post("/users/register", userData)
    if (response.data?.token) {
      tokenManager.setToken(response.data.token)
    }
    return response
  },
  logout: () => {
    tokenManager.clearToken()
  },
}

// Tasks API calls
export const tasksAPI = {
  getTasks: () => api.get("/tasks"),
  createTask: (task) => api.post("/tasks", task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
}

export { tokenManager }
export default api
