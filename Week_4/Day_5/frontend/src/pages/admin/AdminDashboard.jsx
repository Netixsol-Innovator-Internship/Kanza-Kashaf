
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";

const AdminDashboard = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/admin/manage-users" className="border rounded-2xl p-5 hover:shadow bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="text-lg font-semibold">Manage Users</div>
          <p className="text-sm text-gray-500">View all users, update roles, block/unblock.</p>
        </Link>
        {user?.role === "superAdmin" && (
          <Link to="/admin/manage-admins" className="border rounded-2xl p-5 hover:shadow bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="text-lg font-semibold">Manage Admins</div>
            <p className="text-sm text-gray-500">View admins, demote to user, block/unblock.</p>
          </Link>
        )}
        <Link to="/admin/add-product" className="border rounded-2xl p-5 hover:shadow bg-white dark:bg-gray-900 dark:border-gray-800">
          <div className="text-lg font-semibold">Add Product</div>
          <p className="text-sm text-gray-500">Create a new product.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
