"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../redux/apiSlice"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // use Redux auth slice directly
  const user = useSelector((state) => state.auth.user)

  const {
    data: cartData,
    isLoading: cartLoading,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !user })

  const [addToCartMutation] = useAddToCartMutation()
  const [updateCartMutation] = useUpdateCartMutation()
  const [removeFromCartMutation] = useRemoveFromCartMutation()
  const [clearCartMutation] = useClearCartMutation()

  useEffect(() => {
    if (cartData) {
      let items = []
      if (cartData.data?.cart?.items) {
        items = cartData.data.cart.items
      } else if (cartData.cart?.items) {
        items = cartData.cart.items
      } else if (cartData.data?.items) {
        items = cartData.data.items
      } else if (cartData.items) {
        items = cartData.items
      }

      setCartItems(items)
      setCartCount(items.reduce((total, item) => total + item.quantity, 0))
    } else if (!user) {
      setCartItems([])
      setCartCount(0)
    }
    setLoading(cartLoading)
  }, [cartData, cartLoading, user])

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      return { success: false, message: "Please login to add items to cart" }
    }
    try {
      await addToCartMutation({ productId, quantity }).unwrap()
      await refetchCart()
      return { success: true, message: "Item added to cart" }
    } catch (error) {
      return {
        success: false,
        message: error?.data?.message || "Failed to add item to cart",
      }
    }
  }

  // Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user) return
    try {
      await updateCartMutation({ productId, quantity }).unwrap()
      await refetchCart()
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  // Remove from cart
  const removeFromCart = async (productId) => {
    if (!user) return
    try {
      await removeFromCartMutation(productId).unwrap()
      await refetchCart()
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!user) return
    try {
      await clearCartMutation().unwrap()
      setCartItems([])
      setCartCount(0)
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  // Cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
  }

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    fetchCart: refetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
