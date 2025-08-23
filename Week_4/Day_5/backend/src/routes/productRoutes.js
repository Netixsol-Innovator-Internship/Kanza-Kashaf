const express = require("express")
const multer = require("multer")
const { body, param, query } = require("express-validator")
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// Store images in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
})

const upload = multer({ storage });

const productValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Product name must be between 2 and 100 characters"),
  body("description").trim().isLength({ min: 10, max: 500 }).withMessage("Description must be between 10 and 500 characters"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("image").optional().isString().withMessage("Image must be a string"),
  body("category")
    .isIn(["black-tea", "green-tea", "herbal-tea", "oolong-tea", "white-tea", "chai", "matcha", "rooibos", "teaware"])
    .withMessage("Invalid category"),
  body("origin").trim().isIn(["India", "Japan", "Iran", "South Africa"]).withMessage("Origin must be one of: India, Japan, Iran, South Africa"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("collection")
    .optional()
    .isIn(["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"])
    .withMessage("Invalid collection"),
  body("caffeine")
    .optional()
    .isIn(["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"])
    .withMessage("Invalid caffeine level"),
  body("flavour").optional().isArray().withMessage("Flavour must be an array"),
  body("flavour.*")
    .optional()
    .isIn(["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"])
    .withMessage("Invalid flavour option"),
  body("qualities").optional().isArray().withMessage("Qualities must be an array"),
  body("qualities.*").optional().isIn(["Detox", "Energy", "Relax", "Digestion"]).withMessage("Invalid quality option"),
  body("allergens").optional().isArray().withMessage("Allergens must be an array"),
  body("allergens.*")
    .optional()
    .isIn(["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"])
    .withMessage("Invalid allergen option"),
  body("organic").optional().isBoolean().withMessage("Organic must be a boolean value"),
]

const idValidation = [param("id").isMongoId().withMessage("Invalid product ID")]

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [black-tea, green-tea, herbal-tea, oolong-tea, white-tea, chai, matcha, rooibos, teaware]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get("/", getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (Super Admin & Admin only)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", idValidation, validateRequest, getProductById)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product (Super Admin & Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - image
 *               - category
 *               - origin
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               origin:
 *                 type: string
 *               stock:
 *                 type: integer
 *               collection:
 *                 type: string
 *               caffeine:
 *                 type: string
 *               flavour:
 *                 type: array
 *               qualities:
 *                 type: array
 *               allergens:
 *                 type: array
 *               organic:
 *                 type: boolean
 *             example:
 *               name: "Premium Green Tea"
 *               description: "High-quality organic green tea from Japan"
 *               price: 12.99
 *               image: "https://example.com/images/green-tea.jpg"
 *               category: "green-tea"
 *               origin: "Japan"
 *               stock: 50
 *               collection: "Green teas"
 *               caffeine: "Medium Caffeine"
 *               flavour: ["Smooth", "Fruity"]
 *               qualities: ["Energy", "Digestion"]
 *               allergens: ["Gluten-free", "Nuts-free"]
 *               organic: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, role("admin", "superAdmin"), upload.single("image"), productValidation, validateRequest, createProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Super Admin & Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               origin:
 *                 type: string
 *               stock:
 *                 type: integer
 *               collection:
 *                 type: string
 *               caffeine:
 *                 type: string
 *               flavour:
 *                 type: array
 *               qualities:
 *                 type: array
 *               allergens:
 *                 type: array
 *               organic:
 *                 type: boolean
 *             example:
 *               name: "Jasmine Green Tea"
 *               description: "A fragrant blend of premium green tea leaves with jasmine aroma."
 *               price: 10.99
 *               image: "https://example.com/images/jasmine-green-tea.jpg"
 *               category: "Green Tea"
 *               origin: "China"
 *               stock: 120
 *               collection: "Green teas"
 *               caffeine: "Medium Caffeine"
 *               flavour: ["Smooth", "Fruity"]
 *               qualities: ["Energy", "Digestion"]
 *               allergens: ["Gluten-free", "Nuts-free"]
 *               organic: true
 *     responses:
 *       200:
 *         description: Product data fetched successfully (ready for edit) and updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 image:
 *                   type: string
 *                 category:
 *                   type: string
 *                 origin:
 *                   type: string
 *                 stock:
 *                   type: integer
 *                 collection:
 *                   type: string
 *                 caffeine:
 *                   type: string
 *                 flavour:
 *                   type: array
 *                 qualities:
 *                   type: array
 *                 allergens:
 *                   type: array
 *                 organic:
 *                   type: boolean
 *             example:
 *               _id: "66b9f7e2e3f3a6c4b09e2d12"
 *               name: "Jasmine Green Tea"
 *               description: "A fragrant blend of premium green tea leaves with jasmine aroma."
 *               price: 10.99
 *               image: "https://example.com/images/jasmine-green-tea.jpg"
 *               category: "Green Tea"
 *               origin: "China"
 *               stock: 120
 *               collection: "Green teas"
 *               caffeine: "Medium Caffeine"
 *               flavour: ["Smooth", "Fruity"]
 *               qualities: ["Energy", "Digestion"]
 *               allergens: ["Gluten-free", "Nuts-free"]
 *               organic: true
 *       404:
 *         description: Product not found
 */
router.put("/:id", auth, role("admin", "superAdmin"), idValidation, productValidation, validateRequest, updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Super Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", auth, auth, role("superAdmin"), idValidation, validateRequest, deleteProduct)

module.exports = router
