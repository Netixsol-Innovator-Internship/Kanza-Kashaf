import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "../features/api/productApi";
import { userApi } from "../features/api/userApi";
import { authApi } from "../features/api/authApi";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      userApi.middleware,
      authApi.middleware
    ),
});
