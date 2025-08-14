"use client"

import { useState } from "react"

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete, loading }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editForm, setEditForm] = useState({})

  const handleEditStart = (task) => {
    setEditingTask(task._id)
    setEditForm({
      title: task.title,
      description: task.description,
      status: task.status || "pending",
      priority: task.priority,
      completed: task.completed,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    })
  }

  const handleEditCancel = () => {
    setEditingTask(null)
    setEditForm({})
  }

  const handleEditSubmit = (taskId) => {
    onTaskUpdate(taskId, editForm)
    setEditingTask(null)
    setEditForm({})
  }

  const handleEditChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    const updatedForm = {
      ...editForm,
      [e.target.name]: value,
    }

    if (e.target.name === "completed") {
      updatedForm.status = value ? "completed" : editForm.status === "completed" ? "pending" : editForm.status
    }

    if (e.target.name === "status") {
      if (value === "completed") {
        updatedForm.completed = true
      } else {
        updatedForm.completed = false
      }
    }

    setEditForm(updatedForm)
  }

  const toggleComplete = (task) => {
    const nextCompleted = !task.completed
    onTaskUpdate(task._id, {
      ...task,
      completed: nextCompleted,
      status: nextCompleted ? "completed" : task.status === "completed" ? "pending" : task.status,
    })
  }

  if (loading) {
    return <div className="loading">Loading tasks...</div>
  }

  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks found. Create your first task!</div>
  }

  return (
    <div className="task-list">
      <h3>Your Tasks ({tasks.length})</h3>
      {tasks.map((task, index) => (
        <div
          key={task._id ? `${task._id}-${index}` : `task-${index}`}
          className={`task-item ${task.completed ? "completed" : task.status === "completed" ? "completed" : ""}`}
        >
          {editingTask === task._id ? (
            <div className="task-edit">
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Task title"
              />
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Task description"
                rows="2"
              />
              <select name="status" value={editForm.status} onChange={handleEditChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select name="priority" value={editForm.priority} onChange={handleEditChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={editForm.dueDate}
                onChange={handleEditChange}
                placeholder="Due date"
              />
              <label>
                <input type="checkbox" name="completed" checked={editForm.completed} onChange={handleEditChange} />
                Completed
              </label>
              <div className="task-actions">
                <button onClick={() => handleEditSubmit(task._id)}>Save</button>
                <button onClick={handleEditCancel}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="task-display">
              <div className="task-header">
                <h4>{task.title}</h4>
                <div className="task-badges">
                  <span className={`status status-${task.completed ? "completed" : task.status || "pending"}`}>
                    {task.completed ? "completed" : task.status || "pending"}
                  </span>
                  <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                </div>
              </div>
              {task.description && <p className="task-description">{task.description}</p>}
              {task.dueDate && (
                <p className="task-due-date">
                  <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString("en-GB")}
                </p>
              )}
              <div className="task-actions">
                <button
                  onClick={() => toggleComplete(task)}
                  className={task.completed ? "mark-incomplete" : "mark-complete"}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button onClick={() => handleEditStart(task)}>Edit</button>
                <button onClick={() => onTaskDelete(task._id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TaskList
