import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../features/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { normalizeRole } from "../features/auth/roleUtils";

export default function Login(){
  const [login, { isLoading, error, data }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    if(data?.token && data?.user){
      const role = normalizeRole(data.user.role);
      dispatch(setCredentials({ token: data.token, user: { ...data.user, role } }));
      const redirect =
        role === "admin" ? "/admin/dashboard" :
        role === "superAdmin" ? "/superadmin/dashboard" :
        location.state?.from?.pathname || "/";
      navigate(redirect, { replace: true });
    }
  },[data, dispatch, navigate, location]);

  const onSubmit = async (e)=>{
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    try{
      await login(body).unwrap();
    }catch(err){ /* handled by error state */ }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="email" type="email" required placeholder="Email" className="w-full rounded border px-3 py-2" />
        <input name="password" type="password" required placeholder="Password" className="w-full rounded border px-3 py-2" />
        <button disabled={isLoading} className="w-full rounded bg-black text-white py-2 disabled:opacity-50">Login</button>
        {error && <p className="text-red-600 text-sm">{error?.data?.message || "Login failed"}</p>}
      </form>
    </div>
  );
}
