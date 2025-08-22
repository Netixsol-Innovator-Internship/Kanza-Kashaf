import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

// Simple auth reducer (replace with your real authSlice if you have it)
const authReducer = (state = { token: null, user: null }, action) => {
  switch (action.type) {
    case "auth/setCredentials":
      return { ...state, token: action.payload.token, user: action.payload.user };
    case "auth/logout":
      return { token: null, user: null };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
