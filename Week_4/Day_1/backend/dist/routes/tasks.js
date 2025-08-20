"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskStore_1 = require("../data/taskStore");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with statistics
 *     description: Retrieve all tasks along with completion statistics
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Successfully retrieved all tasks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TasksResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", (req, res) => {
    const tasks = taskStore_1.taskStore.getAllTasks();
    const stats = taskStore_1.taskStore.getStats();
    res.json({ tasks, stats });
});
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided title
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", (req, res) => {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
        return res.status(400).json({
            error: "Task title is required and cannot be empty",
        });
    }
    const trimmedTitle = title.trim();
    const existingTask = taskStore_1.taskStore.getAllTasks().find((task) => task.title.toLowerCase() === trimmedTitle.toLowerCase());
    if (existingTask) {
        return res.status(400).json({
            error: "Task with this title already exists",
        });
    }
    const task = taskStore_1.taskStore.createTask(trimmedTitle);
    res.status(201).json(task);
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (updates.title !== undefined && updates.title.trim().length === 0) {
        return res.status(400).json({
            error: "Task title cannot be empty",
        });
    }
    const updatedTask = taskStore_1.taskStore.updateTask(id, updates);
    if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const deleted = taskStore_1.taskStore.deleteTask(id);
    if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=tasks.js.map