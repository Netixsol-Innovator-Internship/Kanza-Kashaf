import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/LoginPage";
import Collections from "./pages/CollectionsPage";
import ProductDetail from "./pages/ProductPage";
import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import PeopleManager from "./pages/PeopleManager";
import RequireRole from "./components/RequireRole";
import AuthGate from "./components/AuthGate";

export default function App(){
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <AuthGate>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/collections" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route
            path="/products/add"
            element={
              <RequireRole roles={["admin","superAdmin"]}>
                <AddProduct />
              </RequireRole>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireRole roles={["admin","superAdmin"]}>
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/superadmin/dashboard"
            element={
              <RequireRole roles={["superAdmin"]}>
                <SuperAdminDashboard />
              </RequireRole>
            }
          />
          {/* Manage Users for Admins (only users list) */}
          <Route
            path="/admin/manage-users"
            element={
              <RequireRole roles={["admin"]}>
                <PeopleManager roleFilter="user" />
              </RequireRole>
            }
          />
          {/* Manage Users for SuperAdmin (users) */}
          <Route
            path="/superadmin/manage-users"
            element={
              <RequireRole roles={["superAdmin"]}>
                <PeopleManager roleFilter="user" superAdminMode />
              </RequireRole>
            }
          />
          {/* Manage Admins for SuperAdmin (admins) */}
          <Route
            path="/superadmin/manage-admins"
            element={
              <RequireRole roles={["superAdmin"]}>
                <PeopleManager roleFilter="admin" superAdminMode />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthGate>
    </div>
  );
}
