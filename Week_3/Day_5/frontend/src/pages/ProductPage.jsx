"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"

const ProductPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedVariant, setSelectedVariant] = useState("50g")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`)
      setProduct(response.data.data.product)
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    const result = await addToCart(product._id, quantity)

    if (result.success) {
      alert("Product added to cart!")
    } else {
      alert(result.message)
    }
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <Link to="/collections" className="text-gray-600 hover:text-gray-800">
              COLLECTIONS
            </Link>
            <span className="mx-2">/</span>
            <Link
              to={`/collections/${product.collection?.toLowerCase().replace(" ", "-")}`}
              className="text-gray-600 hover:text-gray-800"
            >
              {product.collection?.toUpperCase()}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800 uppercase">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 mb-16 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">
                {product.description || "A lovely warming Chai tea with ginger cinnamon flavours."}
              </p>

              <div className="flex items-center space-x-16 text-sm text-gray-600 mt-8 mb-4">
                <div className="flex items-center">
                  <img src="/images/World.png" alt="world" className="mr-2"/>
                  <span className="font-medium">Origin: {product.origin || "Iran"}</span>
                </div>
                {product.organic && (
                  <div className="flex items-center">
                    <img src="/images/Organic.png" alt="organic" className="mr-2"/>
                    <span className="font-medium">Organic</span>
                  </div>
                )}
                <div className="flex items-center">
                  <img src="/images/Vegan.png" alt="vegan" className="mr-2"/>
                  <span className="font-medium">Vegan</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-4 mt-10">€{product.price.toFixed(2)}</div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="text-lg mb-2">Variants</h3>
              <div className="grid grid-cols-6 gap-3">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`text-center transition-colors ${
                      selectedVariant === variant.id
                        ? "border border-yellow-500"
                        : "hover:border-gray-400"
                    }`}
                  >
                    <div className="mb-2 pt-2 flex justify-center">
                      <img src={variant.image} alt={variant.label} className="w-10 h-10 object-contain"/>
                    </div>
                    <div className="text-sm pb-2">{variant.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                  -
                </button>
                <span className="w-12 text-center text-lg">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50">
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button onClick={handleAddToCart} disabled={addingToCart}
                className="flex-1 bg-gray-800 text-white py-3 px-6 font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {addingToCart ? ( "ADDING...") : (
                  <>
                    <img src="/images/Bag.png" alt="cart" className="w-4 h-4 inline-block" />
                    ADD TO BAG
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
        <div className="w-full bg-gray-100 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
              {/* Steeping Instructions */}
              <div>
                <h3 className="text-4xl mb-10">Steeping instructions</h3>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <img src="/images/Kettle.png" alt="kettle" className="mr-3 pb-4"/>
                    <span className="pb-4 border-b-2 border-gray-400">
                      <strong>SERVING SIZE:</strong> 2 tsp per cup, 6 tsp per pot
                    </span>
                  </div>
                  <div className="flex items-center">
                    <img src="/images/Drop.png" alt="drop" className="mr-3 pb-4"/>
                    <span className="pb-4 border-b-2 border-gray-400">
                      <strong>WATER TEMPERATURE:</strong> 100°C
                    </span>
                  </div>
                  <div className="flex items-center">
                    <img src="/images/Clock.png" alt="clock" className="mr-3 pb-4"/>
                    <span className="pb-4 border-b-2 border-gray-400">
                      <strong>STEEPING TIME:</strong> 3 - 5 minutes
                    </span>
                  </div>
                  <div className="flex items-center">
                    <img src="/images/Circle.png" alt="circle" className="mr-3 pb-4"/>
                    <span className="pb-4">
                      <strong>COLOR AFTER 3 MINUTES</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* About this tea */}
              <div>
                <h3 className="text-4xl mb-10">About this tea</h3>
                <div className="grid grid-cols-4 text-sm divide-x divide-gray-300">
                  <div className="px-3">
                    <div className="uppercase text-gray-500 text-xs font-medium mb-1">
                      FLAVOR
                    </div>
                    <div className="text-gray-800">Spicy</div>
                  </div>
                  <div className="px-3">
                    <div className="uppercase text-gray-500 text-xs font-medium mb-1">
                      QUALITIES
                    </div>
                    <div className="text-gray-800">Smoothing</div>
                  </div>
                  <div className="px-3">
                    <div className="uppercase text-gray-500 text-xs font-medium mb-1">
                      CAFFEINE
                    </div>
                    <div className="text-gray-800">Medium</div>
                  </div>
                  <div className="px-3">
                    <div className="uppercase text-gray-500 text-xs font-medium mb-1">
                      ALLERGENS
                    </div>
                    <div className="text-gray-800">Nuts-free</div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-4xl mb-8">Ingredient</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.ingredients ||
                      "Black Ceylon tea, Green tea, Ginger root, Cloves, Black pepper, Cinnamon sticks, Cardamom, Cinnamon pieces."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Related Products (Hardcoded) */}
      <div className="my-16">
        <h2 className="text-2xl font-semibold text-center mb-12">You may also like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Product 1 */}
          <div className="text-center">
            <img
              src="/images/Img1.png"
              alt="Ceylon Ginger Cinnamon chai tea"
              className="mx-auto w-56 h-56 object-contain"
            />
            <p className="mt-4 text-gray-900">Ceylon Ginger</p>
            <p className="text-gray-900">Cinnamon chai tea</p>
            <p className="mt-2 text-gray-800 font-medium">€4.85 / 50 g</p>
          </div>

          {/* Product 2 */}
          <div className="text-center">
            <img
              src="/images/Img2.png"
              alt="Ceylon Ginger Cinnamon chai tea"
              className="mx-auto w-56 h-56 object-contain"
            />
            <p className="mt-4 text-gray-900">Ceylon Ginger</p>
            <p className="text-gray-900">Cinnamon chai tea</p>
            <p className="mt-2 text-gray-800 font-medium">€4.85 / 50 g</p>
          </div>

          {/* Product 3 */}
          <div className="text-center">
            <img
              src="/images/Img3.png"
              alt="Ceylon Ginger Cinnamon chai tea"
              className="mx-auto w-56 h-56 object-contain"
            />
            <p className="mt-4 text-gray-900">Ceylon Ginger</p>
            <p className="text-gray-900">Cinnamon chai tea</p>
            <p className="mt-2 text-gray-800 font-medium">€4.85 / 50 g</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage
