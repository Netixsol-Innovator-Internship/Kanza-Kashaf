import { createSlice } from "@reduxjs/toolkit";
import { normalizeRole } from "./roleUtils";

const saved = localStorage.getItem("tea_auth");
const initialState = saved ? JSON.parse(saved) : { user: null, token: null, hydrated: false };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      const role = normalizeRole(payload?.user?.role);
      state.user = payload.user ? { ...payload.user, role } : null;
      state.token = payload.token || state.token;
      state.hydrated = true;
      localStorage.setItem("tea_auth", JSON.stringify(state));
    },
    setUser: (state, { payload }) => {
      const role = normalizeRole(payload?.role);
      state.user = payload ? { ...payload, role } : null;
      state.hydrated = true;
      localStorage.setItem("tea_auth", JSON.stringify(state));
    },
    setHydrated: (state) => {
      state.hydrated = true;
      localStorage.setItem("tea_auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.hydrated = true;
      localStorage.removeItem("tea_auth");
    },
  },
});

export const { setCredentials, logout, setUser, setHydrated } = slice.actions;
export default slice.reducer;
