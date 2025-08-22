
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../features/auth/authSlice";

const AdminNav = () => {
  const user = useSelector(selectCurrentUser);
  if (!user || (user.role !== "admin" && user.role !== "superAdmin")) return null;

  return (
    <div className="flex items-center gap-3">
      <Link className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800" to="/admin">
        Admin
      </Link>
      {user.role === "superAdmin" && (
        <Link className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800" to="/admin/manage-admins">
          Manage Admin
        </Link>
      )}
      <Link className="px-3 py-1 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800" to="/admin/manage-users">
        Manage User
      </Link>
    </div>
  );
};

export default AdminNav;
