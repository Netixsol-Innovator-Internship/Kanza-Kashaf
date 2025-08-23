const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["black-tea", "green-tea", "herbal-tea", "oolong-tea", "white-tea", "chai", "matcha", "rooibos", "teaware"],
    },
    collection: {
      type: String,
      enum: ["Black teas", "Green teas", "White teas", "Chai", "Matcha", "Herbal teas", "Oolong", "Rooibos", "Teaware"],
      default: "Black teas",
    },
    origin: {
      type: String,
      required: [true, "Origin is required"],
    },
    caffeine: {
      type: String,
      enum: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"],
      default: "Medium Caffeine",
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [1, "Stock cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    flavour: [
      {
        type: String,
        enum: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"],
      },
    ],
    qualities: [
      {
        type: String,
        enum: ["Detox", "Energy", "Relax", "Digestion"],
      },
    ],
    allergens: [
      {
        type: String,
        enum: ["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"],
      },
    ],
    organic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
productSchema.index({ name: "text", description: "text", tags: "text" })

module.exports = mongoose.model("Product", productSchema)
