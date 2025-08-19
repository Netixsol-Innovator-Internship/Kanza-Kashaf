import type { Task } from "../types/task"

class TaskStore {
  private tasks: Task[] = []
  private nextId = 1

  getAllTasks(): Task[] {
    return this.tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return a.completed ? 1 : -1
    })
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find((task) => task.id === id)
  }

  createTask(title: string): Task {
    const task: Task = {
      id: this.nextId.toString(),
      title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.tasks.push(task)
    this.nextId++
    return task
  }

  updateTask(id: string, updates: Partial<Pick<Task, "title" | "completed">>): Task | null {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return null
    }

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date(),
    }

    return this.tasks[taskIndex]
  }

  deleteTask(id: string): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === id)

    if (taskIndex === -1) {
      return false
    }

    this.tasks.splice(taskIndex, 1)
    return true
  }

  getStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.completed).length
    const pending = total - completed

    return { total, completed, pending }
  }
}

export const taskStore = new TaskStore()
