import { Router, type Request, type Response } from "express"
import { taskStore } from "../data/taskStore"

const router = Router()

export interface CreateTaskRequest {
  title: string
}
export interface UpdateTaskRequest {
  title?: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

router.get("/", (req: Request, res: Response) => {
  const tasks = taskStore.getAllTasks()
  const stats = taskStore.getStats()
  res.json({ tasks, stats })
})

router.post("/", (req: Request, res: Response) => {
  const { title }: CreateTaskRequest = req.body

  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      error: "Task title is required and cannot be empty",
    })
  }

  const task = taskStore.createTask(title.trim())
  res.status(201).json(task)
})

// router.put("/:id", (req: Request, res: Response) => {
//   const { id } = req.params
//   const updates: UpdateTaskRequest = req.body

//   if (updates.title !== undefined && updates.title.trim().length === 0) {
//     return res.status(400).json({
//       error: "Task title cannot be empty",
//     })
//   }

//   const updatedTask = taskStore.updateTask(id, updates)

//   if (!updatedTask) {
//     return res.status(404).json({ error: "Task not found" })
//   }

//   res.json(updatedTask)
// })

// router.delete("/:id", (req: Request, res: Response) => {
//   const { id } = req.params

//   const deleted = taskStore.deleteTask(id)

//   if (!deleted) {
//     return res.status(404).json({ error: "Task not found" })
//   }

//   res.status(204).send()
// })

export default router
