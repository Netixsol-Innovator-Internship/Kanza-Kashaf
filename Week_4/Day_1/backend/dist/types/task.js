"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskStore_1 = require("../data/taskStore");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const tasks = taskStore_1.taskStore.getAllTasks();
    const stats = taskStore_1.taskStore.getStats();
    res.json({ tasks, stats });
});
router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
        return res.status(400).json({
            error: "Task title is required and cannot be empty",
        });
    }
    const task = taskStore_1.taskStore.createTask(title.trim());
    res.status(201).json(task);
});
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
exports.default = router;
//# sourceMappingURL=task.js.map