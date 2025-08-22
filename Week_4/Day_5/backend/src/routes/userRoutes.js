const express = require("express")
const { getUsers, changeUserRole, toggleBlockUser } = require("../controllers/userController")
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

router.use(auth)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin & superAdmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient role
 */
router.get("/", role("admin", "superAdmin"),  validateRequest, getUsers)

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Change user role (admin & superAdmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, superAdmin]
 *             example:
 *               role: admin
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role or action
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/role", role("admin", "superAdmin"),  validateRequest, changeUserRole)

/**
 * @swagger
 * /api/users/{id}/block:
 *   patch:
 *     summary: Block or unblock a user (admin & superAdmin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User block status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.patch("/:id/block", role("admin", "superAdmin"),  validateRequest, toggleBlockUser)

module.exports = router
