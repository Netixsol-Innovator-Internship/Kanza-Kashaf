"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import CartPopup from "./CartPopup"

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const [showCartPopup, setShowCartPopup] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/Logo.png" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-semibold text-gray-800">Brand Name</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/collections" className="text-gray-600 hover:text-gray-800 font-medium">
              TEA COLLECTIONS
            </Link>
            <Link to="/accessories" className="text-gray-600 hover:text-gray-800 font-medium">
              ACCESSORIES
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-800 font-medium">
              BLOG
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-800 font-medium">
              CONTACT US
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-12">
            {/* Search */}
            <button className="text-gray-600 hover:text-gray-800">
              <img src="/images/Search.png" alt="Search"/>
            </button>

            {/* User Account */}
            {user ? (
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-800">
                  <img src="/images/Person.png" alt="User"/>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">Hello, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                <img src="/images/Person.png" alt="Login" />
              </Link>
            )}

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setShowCartPopup(!showCartPopup)}
                className="text-gray-600 hover:text-gray-800 relative"
              >
                <img src="/images/Cart.png" alt="Cart" className="mt-1" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {showCartPopup && <CartPopup onClose={() => setShowCartPopup(false)} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
