import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './authSlice';

const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer, auth: authReducer },
  middleware: (gDM) => gDM().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
