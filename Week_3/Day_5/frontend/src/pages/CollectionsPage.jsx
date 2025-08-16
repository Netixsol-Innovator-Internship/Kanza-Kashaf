"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import axios from "axios"

const CollectionsPage = () => {
  const { category } = useParams()
  const location = useLocation()
  const [products, setProducts] = useState([]) // always array
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    collections: [],
    origins: [],
    flavours: [],
    qualities: [],
    cafeines: [],
    allergens: [],
    organic: false,
  })
  const [expandedFilters, setExpandedFilters] = useState({
    collections: false,
    origins: false,
    flavours: false,
    qualities: false,
    cafeines: false,
    allergens: false,
  })
  const [sortBy, setSortBy] = useState("name")

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  const filterOptions = {
    collections: [
      "Black teas",
      "Green teas",
      "White teas",
      "Chai",
      "Matcha",
      "Herbal teas",
      "Oolong",
      "Rooibos",
      "Teaware",
    ],
    origins: ["India", "Japan", "Iran", "South Africa"],
    flavours: ["Spicy", "Sweet", "Citrus", "Smooth", "Fruity", "Floral", "Grassy", "Minty", "Bitter", "Creamy"],
    qualities: ["Detox", "Energy", "Relax", "Digestion"],
    cafeines: ["No Caffeine", "Low Caffeine", "Medium Caffeine", "High Caffeine"],
    allergens: ["Lactose-free", "Gluten-free", "Nuts-free", "Soy-free"],
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const newFilters = { ...filters }
    const newExpandedFilters = { ...expandedFilters }

    // Check each filter type in URL parameters
    Object.keys(filterOptions).forEach((filterType) => {
      const paramValue = searchParams.get(filterType)
      if (paramValue) {
        newFilters[filterType] = [paramValue]
        newExpandedFilters[filterType] = true // Auto-expand sections with active filters
      }
    })

    // Check organic parameter
    if (searchParams.get("organic") === "true") {
      newFilters.organic = true
    }

    setFilters(newFilters)
    setExpandedFilters(newExpandedFilters)
  }, [location.search])

  useEffect(() => {
    applyFilters()
  }, [products, filters, category, sortBy]) // ✅ include sortBy

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`)
      const data = response.data?.data?.products || []
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([]) // fallback
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const safeProducts = Array.isArray(products) ? [...products] : [] // ✅ safe
    let filtered = safeProducts

    // Filter by category from URL
    if (category) {
      const categoryName = category.replace("-", " ").toUpperCase()
      filtered = filtered.filter((product) => product.collection?.toUpperCase() === categoryName)
    }

    // Apply other filters
    if (filters.collections.length > 0) {
      filtered = filtered.filter((product) => filters.collections.includes(product.collection))
    }

    if (filters.origins.length > 0) {
      filtered = filtered.filter((product) => filters.origins.includes(product.origin))
    }

    if (filters.flavours.length > 0) {
      filtered = filtered.filter(
        (product) => Array.isArray(product.flavour) && product.flavour.some((f) => filters.flavours.includes(f)),
      )
    }

    if (filters.qualities.length > 0) {
      filtered = filtered.filter(
        (product) => Array.isArray(product.qualities) && product.qualities.some((q) => filters.qualities.includes(q)),
      )
    }

    if (filters.cafeines.length > 0) {
      filtered = filtered.filter((product) => filters.cafeines.includes(product.caffeine))
    }

    if (filters.allergens.length > 0) {
      filtered = filtered.filter(
        (product) => Array.isArray(product.allergens) && product.allergens.some((a) => filters.allergens.includes(a)),
      )
    }

    if (filters.organic) {
      filtered = filtered.filter((product) => product.organic)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }))
  }

  const toggleExpandedFilter = (filterType) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url('/images/BgPic.png')` }}>
        <div className="h-full bg-black bg-opacity-20"></div>
      </div>

      {/* Breadcrumb */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm flex flex-wrap items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              HOME
            </Link>
            <span className="mx-2">/</span>
            <Link to="/collections" className="text-gray-600 hover:text-gray-800">
              COLLECTIONS
            </Link>

            {/* Category from URL */}
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800 uppercase">{category.replace("-", " ")}</span>
              </>
            )}

            {Object.entries(filters).map(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return value.map((val) => (
                  <span key={`${key}-${val}`} className="flex items-center">
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 capitalize">{val}</span>
                  </span>
                ))
              }
              if (typeof value === "boolean" && value) {
                return (
                  <span key={key} className="flex items-center">
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 capitalize">{key}</span>
                  </span>
                )
              }
              return null
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-6">
              {/* Collections Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("collections")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  COLLECTIONS
                  <span className="text-lg">{expandedFilters.collections ? "-" : "+"}</span>
                </button>
                {expandedFilters.collections && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.collections.map((collection) => (
                      <label key={collection} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.collections.includes(collection)}
                          onChange={() => toggleFilter("collections", collection)}
                          className="mr-2"
                        />
                        <span className="text-sm">{collection}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Origin Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("origins")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  ORIGIN
                  <span className="text-lg">{expandedFilters.origins ? "-" : "+"}</span>
                </button>
                {expandedFilters.origins && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.origins.map((origin) => (
                      <label key={origin} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.origins.includes(origin)}
                          onChange={() => toggleFilter("origins", origin)}
                          className="mr-2"
                        />
                        <span className="text-sm">{origin}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Flavour Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("flavours")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  FLAVOUR
                  <span className="text-lg">{expandedFilters.flavours ? "-" : "+"}</span>
                </button>
                {expandedFilters.flavours && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.flavours.map((flavour) => (
                      <label key={flavour} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.flavours.includes(flavour)}
                          onChange={() => toggleFilter("flavours", flavour)}
                          className="mr-2"
                        />
                        <span className="text-sm">{flavour}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Qualities Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("qualities")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  QUALITIES
                  <span className="text-lg">{expandedFilters.qualities ? "-" : "+"}</span>
                </button>
                {expandedFilters.qualities && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.qualities.map((quality) => (
                      <label key={quality} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.qualities.includes(quality)}
                          onChange={() => toggleFilter("qualities", quality)}
                          className="mr-2"
                        />
                        <span className="text-sm">{quality}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Cafeine Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("cafeines")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  CAFFEINE
                  <span className="text-lg">{expandedFilters.cafeines ? "-" : "+"}</span>
                </button>
                {expandedFilters.cafeines && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.cafeines.map((caffeine) => (
                      <label key={caffeine} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.cafeines.includes(caffeine)}
                          onChange={() => toggleFilter("cafeines", caffeine)}
                          className="mr-2"
                        />
                        <span className="text-sm">{caffeine}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergens Filter */}
              <div>
                <button
                  onClick={() => toggleExpandedFilter("allergens")}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-900 pb-2 border-b"
                >
                  ALLERGENS
                  <span className="text-lg">{expandedFilters.allergens ? "-" : "+"}</span>
                </button>
                {expandedFilters.allergens && (
                  <div className="mt-4 space-y-2">
                    {filterOptions.allergens.map((allergen) => (
                      <label key={allergen} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.allergens.includes(allergen)}
                          onChange={() => toggleFilter("allergens", allergen)}
                          className="mr-2"
                        />
                        <span className="text-sm">{allergen}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Organic Toggle */}
              <div>
                <label className="flex items-center">
                  <span className="font-medium text-gray-900 mr-3">ORGANIC</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          organic: e.target.checked,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-3.5 pt-[1px] border border-black rounded-full ${
                        filters.organic ? "bg-white" : "bg-white"
                      } transition-colors`}
                    >
                      <div
                        className={`w-2.5 h-2.5 bg-black rounded-full transition-transform ${
                          filters.organic ? "translate-x-4" : "translate-x-1"
                        }`}
                      ></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing {filteredProducts.length} products</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={`http://localhost:3000${product.image || "/placeholder.svg"}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-600">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        €{product.price?.toFixed(2)} / {product.weight || "50 g"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsPage
