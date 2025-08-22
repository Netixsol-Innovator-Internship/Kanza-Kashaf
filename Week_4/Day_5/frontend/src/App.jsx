import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthProvider } from "./context/AuthContext.jsx"
import { CartProvider } from "./context/CartContext.jsx"
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./src/components/ProtectedRoute";
import AdminDashboard from "./src/pages/admin/AdminDashboard";
import ManageUsers from "./src/pages/admin/ManageUsers";
import ManageAdmins from "./src/pages/admin/ManageAdmins";
import Navbar from "./components/Navbar.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import CollectionsPage from "./pages/CollectionsPage.jsx"
import AddProduct from "./pages/admin/AddProduct.jsx"
import ProductPage from "./pages/ProductPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx"
import Footer from "./components/Footer.jsx"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tea-app-theme">
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="App min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes element={<ProtectedRoute roles={['admin','superAdmin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/manage-users" element={<ManageUsers />} />
                  <Route path="/admin/manage-admins" element={<ManageAdmins />} />
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:category" element={<CollectionsPage />} />
                  <Route path="/admin/add-product" element={<AddProduct />} />
                  <Route path="/product/:id" element={<ProductPage />} />
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
