
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser, selectToken } from "../features/auth/authSlice";

const ProtectedRoute = ({ roles }) => {
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
