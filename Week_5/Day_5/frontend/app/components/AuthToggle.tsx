"use client"

import { usePathname, useRouter } from "next/navigation"

const AuthToggle = () => {
  const router = useRouter()
  const pathname = usePathname()

  // Determine active tab from current route
  const active: "Register" | "Login" =
    pathname === "/login" ? "Login" : "Register"

  const handleNavigate = (tab: "Register" | "Login") => {
    router.push(tab === "Register" ? "/register" : "/login")
  }

  return (
    <div className="flex w-[220px] md:w-[260px] border border-gray-400 rounded-full my-8 overflow-hidden">
      {/* Register */}
      <button
        onClick={() => handleNavigate("Register")}
        className={`flex-1 py-2 text-sm md:text-base font-medium transition-colors relative ${
          active === "Register"
            ? "bg-[#283981] text-white rounded-full z-10"
            : "bg-white text-[#283981]"
        }`}
      >
        Register
      </button>

      {/* Login */}
      <button
        onClick={() => handleNavigate("Login")}
        className={`flex-1 py-2 text-sm md:text-base font-medium transition-colors relative ${
          active === "Login"
            ? "bg-[#283981] text-white rounded-full z-10"
            : "bg-white text-[#283981]"
        }`}
      >
        Login
      </button>
    </div>
  )
}

export default AuthToggle
