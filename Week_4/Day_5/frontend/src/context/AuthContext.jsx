"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useLoginMutation, useRegisterMutation, useGetProfileQuery } from "../redux/apiSlice"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(
    () => localStorage.getItem("redirectAfterLogin") || null
  )

  // RTK Query hooks
  const [loginMutation] = useLoginMutation()
  const [registerMutation] = useRegisterMutation()

  // Profile query
  const token = localStorage.getItem("token")
  const { data: profileData, isLoading: profileLoading, isError } = useGetProfileQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (profileData?.data?.user) {
      setUser(profileData.data.user)
    } else if (!profileLoading && !token) {
      setUser(null)
    }
    setLoading(profileLoading)
  }, [profileData, profileLoading, token])

  // Login
  const login = async (email, password) => {
    try {
      const result = await loginMutation({ email, password }).unwrap()
      const { token, user } = result.data
      localStorage.setItem("token", token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.data?.message || "Login failed",
      }
    }
  }

  // Register
  const register = async (name, email, password) => {
    try {
      const result = await registerMutation({ name, email, password }).unwrap()
      const { token, user } = result.data
      localStorage.setItem("token", token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error?.data?.message || "Registration failed",
      }
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("redirectAfterLogin")
    setUser(null)
    setRedirectAfterLogin(null)
  }

  // Redirect helpers
  const setRedirectUrl = (url) => {
    setRedirectAfterLogin(url)
    localStorage.setItem("redirectAfterLogin", url)
  }

  const getAndClearRedirectUrl = () => {
    const url = redirectAfterLogin || localStorage.getItem("redirectAfterLogin")
    setRedirectAfterLogin(null)
    localStorage.removeItem("redirectAfterLogin")
    return url
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    setRedirectUrl,
    getAndClearRedirectUrl,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
