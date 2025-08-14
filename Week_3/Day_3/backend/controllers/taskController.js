const Task = require("../models/Task")

// @desc    Get all tasks for authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query

    const query = { user: req.user.id }

    if (status) query.status = status
    if (priority) query.priority = priority

    const tasks = await Task.find(query)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    res.json({
      success: true,
      data: tasks,
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    })
  }
}


// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("user", "name email")

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    res.json({
      success: true,
      data: { task },
    })
  } catch (error) {
    console.error("Get task by ID error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
    })
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      user: req.user.id,
    })

    const populatedTask = await Task.findById(task._id).populate("user", "name email")

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task: populatedTask },
    })
  } catch (error) {
    console.error("Create task error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    })
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body

    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    const updateData = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (status !== undefined) updateData.status = status
    if (priority !== undefined) updateData.priority = priority
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null

    task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email")

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    })
  } catch (error) {
    console.error("Update task error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      })
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }))
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating task",
    })
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      })
    }

    await Task.findByIdAndDelete(req.params.id)

    res.json({
      success: true,
      message: "Task deleted successfully",
      data: { deletedTask: task },
    })
  } catch (error) {
    console.error("Delete task error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      })
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    })
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
}
