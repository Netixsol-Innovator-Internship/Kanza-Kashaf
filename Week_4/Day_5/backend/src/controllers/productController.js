const Product = require("../models/Product")

// Get all products with filtering and pagination
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      collection,
      origin,
      caffeine,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      flavour,
      qualities,
      allergens,
      organic,
    } = req.query

    const filter = { isActive: true }

    if (category) filter.category = category
    if (collection) filter.collection = collection
    if (origin) filter.origin = new RegExp(origin, "i")
    if (caffeine) filter.caffeine = caffeine

    if (flavour) {
      filter.flavour = { $in: Array.isArray(flavour) ? flavour : [flavour] }
    }
    if (qualities) {
      filter.qualities = { $in: Array.isArray(qualities) ? qualities : [qualities] }
    }
    if (allergens) {
      filter.allergens = { $in: Array.isArray(allergens) ? allergens : [allergens] }
    }
    if (organic !== undefined) {
      filter.organic = organic === "true"
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
      filter.$text = { $search: search }
    }

    const skip = (Number(page) - 1) * Number(limit)

    const sort = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const products = await Product.find(filter).sort(sort).skip(skip).limit(Number(limit))

    const total = await Product.countDocuments(filter)
    const totalPages = Math.ceil(total / Number(limit))

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalProducts: total,
          hasNextPage: Number(page) < totalPages,
          hasPrevPage: Number(page) > 1,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    })
  }
}

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      data: { product },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    })
  }
}

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      ...req.body,
      image: imagePath,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    })
  }
}

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      previousData: existingProduct,
      data: { product },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    })
  }
}

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
