import { createSlice } from '@reduxjs/toolkit';

const initialState: { token: string|null, username: string|null, userId: string|null } = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  username: typeof window !== 'undefined' ? localStorage.getItem('username') : null,
  userId: typeof window !== 'undefined' ? localStorage.getItem('userId') : null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      if (typeof window !== 'undefined') localStorage.setItem('token', action.payload);
      try {
        const payload = JSON.parse(atob(action.payload.split('.')[1]));
        state.username = payload.username;
        state.userId = payload.sub;
        localStorage.setItem('username', state.username || '');
        localStorage.setItem('userId', state.userId || '');
      } catch {}
    },
    logout(state) {
      state.token = null; state.username = null; state.userId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token'); localStorage.removeItem('username'); localStorage.removeItem('userId');
        window.location.href = '/';
      }
    }
  }
});
export const { setToken, logout } = slice.actions;
export default slice.reducer;
