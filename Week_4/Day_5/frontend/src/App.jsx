import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthProvider } from "./context/AuthContext.jsx"
import { CartProvider } from "./context/CartContext.jsx"
import Navbar from "./components/Navbar.jsx"
import ManageUsers from "./pages/ManageUsers"
import SuperAdminManageUsers from "./pages/SuperAdminManageUsers"
import SuperAdminManageAdmins from "./pages/SuperAdminManageAdmins"
import LandingPage from "./pages/LandingPage.jsx"
import CollectionsPage from "./pages/CollectionsPage.jsx"
import ProductPage from "./pages/ProductPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import Footer from "./components/Footer.jsx"

// ✅ Import AddProduct page
import AddProduct from "./pages/AddProduct.jsx"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tea-app-theme">
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/admin/manage-users" element={<ManageUsers />} />
                  <Route path="/super-admin/manage-users" element={<SuperAdminManageUsers />} />
                  <Route path="/super-admin/manage-admins" element={<SuperAdminManageAdmins />} />

                  {/* ✅ Collections & Products */}
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:category" element={<CollectionsPage />} />
                  <Route path="/products" element={<CollectionsPage />} />

                  {/* ✅ Product details & Add Product */}
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/add-product" element={<AddProduct />} />

                  {/* ✅ Cart & Auth */}
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
