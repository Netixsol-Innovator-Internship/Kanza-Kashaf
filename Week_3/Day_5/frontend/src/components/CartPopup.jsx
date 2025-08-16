"use client"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useEffect, useRef } from "react"

const CartPopup = ({ onClose }) => {
  const { cartItems, cartCount, getCartTotal, updateQuantity, removeFromCart } = useCart()
  const deliveryFee = 3.95
  const subtotal = getCartTotal()
  const total = subtotal + deliveryFee

  const popupRef = useRef(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  if (cartCount === 0) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Gray overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Popup */}
        <div
          ref={popupRef}
          className="absolute top-0 right-0 w-96 bg-white shadow-lg border flex flex-col"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Bag</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-500 text-center py-12">Your cart is empty</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Gray overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Popup */}
      <div
        ref={popupRef}
        className="absolute top-0 right-0 w-96 bg-white shadow-lg border flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Bag</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-start justify-between">
              <img
                src={`http://localhost:3000${item.product.image}`}
                alt={item.product.name}
                className="w-16 h-16 object-cover"
              />
              <div className="flex-1 px-3">
                <h4 className="text-sm font-medium">{item.product.name}</h4>
                <p className="text-sm text-gray-600">chai tea - {item.product.weight || "50 g"}</p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-xs text-black mt-1 hover:text-red-600"
                >
                  REMOVE
                </button>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm">€{item.product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky bottom summary */}
        <div className="p-6 space-y-2 text-sm">
          <div className="flex justify-between border-t pt-2 mt-2">
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>€{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          {/* Purchase button */}
          <Link to="/cart" onClick={onClose}>
            <button
              to="/cart"
              onClick={onClose}
              className="mt-4 w-full bg-black text-white py-3 text-sm font-medium tracking-wide hover:opacity-90 transition"
            >
              PURCHASE
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPopup
