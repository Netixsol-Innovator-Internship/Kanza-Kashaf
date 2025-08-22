const User = require("../models/User")

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message })
  }
}

// Change role
const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const targetUser = await User.findById(id)
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" })

    if (req.user.role === "admin") {
      if (targetUser.role !== "user") {
        return res.status(403).json({ success: false, message: "Admins can only change roles of users" })
      }
    } else if (req.user.role === "superAdmin") {
      if (role === "superAdmin" && req.user.id === targetUser.id) {
        return res.status(400).json({ success: false, message: "You cannot demote yourself" })
      }
    }

    targetUser.role = role
    await targetUser.save()

    res.status(200).json({ success: true, message: "User role updated", data: targetUser })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update role", error: error.message })
  }
}

// Block / Unblock
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params
    const targetUser = await User.findById(id)
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" })

    targetUser.isBlocked = !targetUser.isBlocked
    await targetUser.save()

    res.status(200).json({
      success: true,
      message: `User ${targetUser.isBlocked ? "blocked" : "unblocked"} successfully`,
      data: targetUser,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update block status", error: error.message })
  }
}

module.exports = { getUsers, changeUserRole, toggleBlockUser }
