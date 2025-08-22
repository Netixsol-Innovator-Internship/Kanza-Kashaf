import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { normalizeRole } from "../features/auth/roleUtils";

export default function Navbar(){
  const { user } = useSelector((s)=>s.auth);
  const dispatch = useDispatch();
  const role = normalizeRole(user?.role);

  const isAdmin = role === "admin";
  const isSuper = role === "superAdmin";

  return (
    <nav className="w-full border-b bg-white/70 dark:bg-zinc-900/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">Tea App</Link>
          <Link to="/collections" className="text-sm opacity-80 hover:opacity-100">Collection</Link>
          <Link to="/contact" className="text-sm opacity-80 hover:opacity-100">Contact Us</Link>
          {isAdmin && (
            <Link to="/admin/manage-users" className="text-sm font-medium px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
              Manage User
            </Link>
          )}
          {isSuper && (
            <>
              <Link to="/superadmin/manage-admins" className="text-sm font-medium px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Manage Admin
              </Link>
              <Link to="/superadmin/manage-users" className="text-sm font-medium px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Manage User
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">{role}</span>
              <button onClick={()=>dispatch(logout())} className="text-sm px-3 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm px-3 py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
