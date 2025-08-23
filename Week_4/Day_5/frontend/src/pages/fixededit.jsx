"use client"

import { useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useSelector } from "react-redux"
import { useGetProductByIdQuery, useUpdateProductMutation } from "../redux/apiSlice"
import { useNavigate } from "react-router-dom"

// Notification Component
const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-4 animate-slideIn">
        <img src="/images/Bag.png" alt="cart" className="w-6 h-6 opacity-80 dark:opacity-60" />
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-gray-600 hover:text-white dark:hover:text-gray-900"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

const ProductPage = () => {
  const { id } = useParams()
  const location = useLocation()
  const { addToCart } = useCart()
  const { setRedirectUrl } = useAuth()
  const [selectedVariant, setSelectedVariant] = useState("50g")
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const { data, error, isLoading, refetch } = useGetProductByIdQuery(id)
  const product = data?.data?.product

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  // ✅ Admin editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  })

  const [updateProduct] = useUpdateProductMutation()

  const handleStartEdit = async () => {
    await refetch()
    setEditData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
    })
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...product,          // keep existing product fields
        ...editData,         // overwrite with changes
        price: Number(editData.price ?? product.price),
        stock: Number(editData.stock ?? product.stock),
      }

      await updateProduct({ id: product._id, updatedData: payload }).unwrap()
      setIsEditing(false)
    } catch (err) {
      console.error("Update failed", err)
    }
  }


  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleAddToCart = async () => {
    if (!user) {
      setRedirectUrl(location.pathname)
      alert("Please login to add items to cart.")
      return
    }

    setAddingToCart(true)
    const result = await addToCart(product._id, quantity)

    if (result.success) {
      setNotification(`${product.name} added to cart!`)
    } else {
      setNotification(result.message)
    }
    setTimeout(() => setNotification(null), 3000)
    setAddingToCart(false)
  }

  const variants = [
    { id: "50g", label: "50 g bag", image: "/images/50.png" },
    { id: "100g", label: "100 g bag", image: "/images/100.png" },
    { id: "170g", label: "170 g bag", image: "/images/170.png" },
    { id: "250g", label: "250 g bag", image: "/images/250.png" },
    { id: "1kg", label: "1 kg bag", image: "/images/1kg.png" },
    { id: "sample", label: "Sampler", image: "/images/Sample.png" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">Loading...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-900 dark:text-white">Product not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="py-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm flex flex-wrap items-center">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              HOME
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <Link to="/collections" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              COLLECTIONS
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <Link
              to={`/collections/${product.collection?.toLowerCase().replace(" ", "-")}`}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {product.collection?.toUpperCase()}
            </Link>
            <span className="mx-2 text-gray-600 dark:text-gray-400">/</span>
            <span className="text-gray-800 dark:text-gray-200 uppercase">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 mb-6 sm:mb-16 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-lg">
            <img src={`${API_BASE_URL}${product.image}`} alt={product.name} className="w-full h-full object-cover"/>
          </div>

          {/* Product Info */}
          <div className="space-y-8 lg:space-y-12">
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (€)</label>
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                    <input
                      type="number"
                      value={editData.stock}
                      onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="font-prosto text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {product.description || "A lovely warming Chai tea with ginger cinnamon flavours."}
                  </p>

                  {/* ✅ Show Edit button only if admin or superAdmin */}
                  {(user?.role === "admin" || user?.role === "superAdmin") && (
                    <button
                      onClick={handleStartEdit}
                      className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Edit Product
                    </button>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 lg:space-x-16 text-sm text-gray-600 dark:text-gray-400 mt-8 mb-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <img src="/images/World.png" alt="world" className="w-5 h-5 mr-2 dark:invert" />
                      <span className="font-medium">Origin: {product.origin || "Iran"}</span>
                    </div>

                    {product.organic && (
                      <div className="flex items-center">
                        <img src="/images/Organic.png" alt="organic" className="w-5 h-5 mr-2 dark:invert" />
                        <span className="font-medium">Organic</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <img src="/images/Vegan.png" alt="vegan" className="w-5 h-5 mr-2 dark:invert" />
                      <span className="font-medium">Vegan</span>
                    </div>
                  </div>

                  <div className="font-prosto text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-10">
                    €{product.price.toFixed(2)}
                  </div>
                </>
              )}
            </div>

            {/* Variants */}
            {!isEditing && (
              <>
                <div>
                  <h3 className="text-lg mb-2 text-gray-900 dark:text-white">Variants</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`text-center transition-colors border rounded-md p-2 ${
                          selectedVariant === variant.id
                            ? "border-yellow-500"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        }`}
                      >
                        <div
                          className={`mb-2 pt-2 flex justify-center p-2 rounded-md ${
                            selectedVariant === variant.id
                              ? "dark:bg-white"
                              : "bg-transparent dark:bg-white/90 hover:bg-gray-50 dark:hover:bg-white"
                          }`}
                        >
                          <img src={variant.image || "/placeholder.svg"} alt={variant.label} className="w-8 h-8 sm:w-10 sm:h-10 object-contain"/>
                        </div>
                        <div className="text-xs sm:text-sm pb-2 text-gray-700 dark:text-gray-300">
                          {variant.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                      -
                    </button>
                    <span className="w-12 text-center text-lg text-gray-900 dark:text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button onClick={handleAddToCart} disabled={addingToCart}
                    className="flex-1 bg-gray-800 dark:bg-gray-700 text-white py-3 px-6 font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-md">
                    {addingToCart ? (
                      "ADDING..."
                    ) : (
                      <>
                        <img src="/images/Bag.png" alt="cart" className="w-4 h-4 inline-block opacity-80" />
                        ADD TO BAG
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Notification */}
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
          </div>
        </div>
      </div>

      {/* The rest of your page (details, instructions, related products) stays unchanged */}
      {/* ... */}
    </div>
  )
}

export default ProductPage
