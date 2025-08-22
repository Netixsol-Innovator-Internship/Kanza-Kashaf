
import { createSlice } from "@reduxjs/toolkit";

const initialState = (() => {
  try {
    const raw = localStorage.getItem("auth");
    if (raw) return JSON.parse(raw);
  } catch {}
  // Fallback for legacy storage (token only)
  const token = localStorage.getItem("token");
  return { user: null, token: token || null };
})();

const persist = (state) => {
  localStorage.setItem("auth", JSON.stringify(state));
  if (state.token) localStorage.setItem("token", state.token);
  else localStorage.removeItem("token");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      persist(state);
    },
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...action.payload };
      persist(state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      persist(state);
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export default authSlice.reducer;
