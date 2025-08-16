"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

const LandingPage = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`)

      // ✅ handle both array or { products: [] } response
      const products = Array.isArray(response.data) ? response.data : response.data.products || []

      // Group products by collection
      const productsByCollection = products.reduce((acc, product) => {
        const collection = product.collection || "Other"
        if (!acc[collection]) {
          acc[collection] = []
        }
        acc[collection].push(product)
        return acc
      }, {})

      setCollections(
        Object.keys(productsByCollection).map((key) => ({
          name: key,
          products: productsByCollection[key],
        })),
      )
    } catch (error) {
      console.error("Error fetching collections:", error)
      setCollections([]) // ✅ avoid state crash
    } finally {
      setLoading(false)
    }
  }

  const collectionImages = {
    "BLACK TEA": "/images/Blacktea.png",
    "GREEN TEA": "/images/Greentea.png",
    "WHITE TEA": "/images/Whitetea.png",
    MATCHA: "/images/Matcha.png",
    "HERBAL TEA": "/images/Herbaltea.png",
    CHAI: "/images/Chai.png",
    OOLONG: "/images/Oolong.png",
    ROOIBOS: "/images/Rooibos.png",
    TEAWARE: "/images/Teaware.png",
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full bg-white pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Left Image */}
          <div className="h-96 lg:h-auto">
            <img src="/images/LandingImage.png" alt="Tea varieties" className="w-full h-full object-cover" />
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-center px-6 py-10 lg:px-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Every day is unique, <br /> just like our tea
            </h1>
            <p className="text-base mb-4 text-gray-700">
              Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
            </p>
            <p className="text-base mb-8 text-gray-700">
              Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
            </p>
            <Link
              to="/collections"
              className="w-[240px] inline-block bg-gray-800 text-white px-16 py-3 font-medium hover:bg-gray-900 transition-colors"
            >
              BROWSE TEAS
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-6 pt-12 bg-black bg-opacity-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-row items-center">
              <img src="/images/Cup.png" alt="cup" className="mr-4" />
              <h3 className="font-semibold">450+ KIND OF LOOSEF TEA</h3>
            </div>
            <div className="flex flex-row items-center">
              <img src="/images/Gift.png" alt="gift" className="mr-4" />
              <h3 className="font-semibold">CERTIFICATED ORGANIC TEAS</h3>
            </div>
            <div className="flex flex-row items-center">
              <img src="/images/Truck.png" alt="truck" className="mr-4" />
              <h3 className="font-semibold">FREE DELIVERY</h3>
            </div>
            <div className="flex flex-row items-center">
              <img src="/images/Tag.png" alt="tag" className="mr-4" />
              <h3 className="font-semibold">SAMPLE FOR ALL TEAS</h3>
            </div>
          </div>
          <div className="text-center mt-16">
            <button className="border border-gray-800 text-gray-800 px-16 py-3 font-medium hover:bg-gray-800 hover:text-white transition-colors">
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Collections</h2>

          {loading ? (
            <div className="text-center">Loading collections...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {/* First Row */}
              <Link to="/collections?collections=Black teas" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["BLACK TEA"] || "/placeholder.svg"}
                    alt="Black Tea"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">BLACK TEA</h3>
              </Link>

              <Link to="/collections?collections=Green teas" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["GREEN TEA"] || "/placeholder.svg"}
                    alt="Green Tea"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">GREEN TEA</h3>
              </Link>

              <Link to="/collections?collections=White teas" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["WHITE TEA"] || "/placeholder.svg"}
                    alt="White Tea"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">WHITE TEA</h3>
              </Link>

              {/* Second Row */}
              <Link to="/collections?collections=Matcha" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["MATCHA"] || "/placeholder.svg"}
                    alt="Matcha"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">MATCHA</h3>
              </Link>

              <Link to="/collections?collections=Herbal teas" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["HERBAL TEA"] || "/placeholder.svg"}
                    alt="Herbal Tea"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">HERBAL TEA</h3>
              </Link>

              <Link to="/collections?collections=Chai" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["CHAI"] || "/placeholder.svg"}
                    alt="Chai"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">CHAI</h3>
              </Link>

              {/* Third Row */}
              <Link to="/collections?collections=Oolong" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["OOLONG"] || "/placeholder.svg"}
                    alt="Oolong"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">OOLONG</h3>
              </Link>

              <Link to="/collections?collections=Rooibos" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["ROOIBOS"] || "/placeholder.svg"}
                    alt="Rooibos"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">ROOIBOS</h3>
              </Link>

              <Link to="/collections?collections=Teaware" className="group flex flex-col items-center">
                <div className="overflow-hidden w-[360px] h-[360px]">
                  <img
                    src={collectionImages["TEAWARE"] || "/placeholder.svg"}
                    alt="Teaware"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-center">TEAWARE</h3>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default LandingPage
