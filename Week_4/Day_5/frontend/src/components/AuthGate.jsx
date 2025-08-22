import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMeQuery } from "../features/api/authApi";
import { setUser, logout, setHydrated } from "../features/auth/authSlice";
import { normalizeRole } from "../features/auth/roleUtils";

export default function AuthGate({ children }){
  const dispatch = useDispatch();
  const { token, hydrated } = useSelector((s)=>s.auth);

  const { data, error, isFetching, isUninitialized } = useMeQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(()=>{
    if(!token && !hydrated){
      dispatch(setHydrated());
    }
  },[token, hydrated, dispatch]);

  useEffect(()=>{
    if(data){
      const role = normalizeRole(data.user?.role || data.role);
      const blocked = data.user?.blocked ?? data.blocked;
      if(blocked){
        dispatch(logout());
        return;
      }
      const user = data.user || data;
      dispatch(setUser({ ...user, role }));
    }
  },[data, dispatch]);

  useEffect(()=>{
    if(error && token){
      dispatch(logout());
    }
  },[error, token, dispatch]);

  if(!hydrated || (token && (isFetching || isUninitialized))){
    return (
      <div className="w-full flex items-center justify-center py-16">
        <div className="animate-pulse text-sm opacity-70">Loading session…</div>
      </div>
    );
  }

  return children;
}
