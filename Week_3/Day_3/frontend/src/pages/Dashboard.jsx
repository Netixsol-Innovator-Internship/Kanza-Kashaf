"use client"

import { useState, useEffect } from "react"
import { tasksAPI, tokenManager } from "../services/api"
import TaskForm from "../components/TaskForm"
import TaskList from "../components/TaskList"
import ThemeToggle from "../components/ThemeToggle"

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!tokenManager.getToken() || !tokenManager.isTokenValid()) {
      setError("Unauthorized: Please log in again.")
      return
    }
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await tasksAPI.getTasks()
      console.log("Tasks API response:", response.data)

      const data = response.data.data || response.data
      setTasks(Array.isArray(data) ? data : [])
      setError("")
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Failed to fetch tasks")
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreate = async (taskData) => {
    setLoading(true)
    try {
      await tasksAPI.createTask(taskData)
      await fetchTasks()
      setError("")
    } catch (err) {
      setError("Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = async (taskId, taskData) => {
    const oldTasks = [...tasks]

    setTasks((prevTasks) => prevTasks.map((task) => (task._id === taskId ? { ...task, ...taskData } : task)))

    try {
      const response = await tasksAPI.updateTask(taskId, taskData)

      if (response.data?.data) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task._id === taskId ? { ...task, ...response.data.data } : task)),
        )
      }
    } catch (err) {
      console.error("Update failed, reverting:", err)
      setTasks(oldTasks)
    }
  }

  const handleTaskDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksAPI.deleteTask(taskId)
        setTasks(tasks.filter((task) => task._id !== taskId))
        setError("")
      } catch (err) {
        setError("Failed to delete task")
      }
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-content">
        <TaskForm onTaskCreate={handleTaskCreate} loading={loading} />
        <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} loading={loading} />
      </div>
    </div>
  )
}

export default Dashboard
