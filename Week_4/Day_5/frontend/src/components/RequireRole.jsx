import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { normalizeRole } from "../features/auth/roleUtils";

const RequireRole = ({ children, roles }) => {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  const role = normalizeRole(user.role);
  const ok = roles.map(normalizeRole).includes(role);
  if (!ok) return <Navigate to="/" replace />;

  return children;
};

export default RequireRole;
