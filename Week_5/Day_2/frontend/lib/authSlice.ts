import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  username: string | null;
  userId: string | null;
};

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    return {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      userId: localStorage.getItem('userId'),
    };
  }
  return { token: null, username: null, userId: null };
};

const slice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
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
      state.token = null;
      state.username = null;
      state.userId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        window.location.href = '/';
      }
    },
  },
});

export const { setToken, logout } = slice.actions;
export default slice.reducer;
