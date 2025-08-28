import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  token: string | null;
  username: string | null;
  userId: string | null;
};

const safeGet = (key: string): string | null => {
  try {
    return (typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined')
      ? (globalThis as any).localStorage.getItem(key)
      : null;
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string | null) => {
  try {
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined') {
      if (value === null) (globalThis as any).localStorage.removeItem(key);
      else (globalThis as any).localStorage.setItem(key, value);
    }
  } catch {
    // noop
  }
};

const safeRemove = (key: string) => {
  try {
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).localStorage !== 'undefined') {
      (globalThis as any).localStorage.removeItem(key);
    }
  } catch {
    // noop
  }
};

const decodeJwtPayload = (token?: string | null): any | null => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadB64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    let jsonStr = '';
    if (typeof (globalThis as any).atob === 'function') {
      jsonStr = (globalThis as any).atob(payloadB64);
    } else if (typeof Buffer !== 'undefined') {
      jsonStr = Buffer.from(payloadB64, 'base64').toString('utf-8');
    } else {
      return null;
    }
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: safeGet('token'),
  username: safeGet('username'),
  userId: safeGet('userId'),
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action) {
      const token: string | null = action.payload ?? null;
      state.token = token;
      safeSet('token', token);

      try {
        const payload = decodeJwtPayload(token);
        if (payload) {
          state.username = payload.username || null;
          state.userId = payload.sub || payload.userId || null;
          safeSet('username', state.username ?? '');
          safeSet('userId', state.userId ?? '');
        }
      } catch {
        // ignore decode errors
      }
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.userId = null;

      safeRemove('token');
      safeRemove('username');
      safeRemove('userId');

      try {
        if (typeof globalThis !== 'undefined' && (globalThis as any).location && typeof (globalThis as any).location.assign === 'function') {
          (globalThis as any).location.assign('/');
        } else if (typeof globalThis !== 'undefined' && (globalThis as any).location) {
          (globalThis as any).location.href = '/';
        }
      } catch {
        // noop - do not throw in reducer
      }
    },
  },
});

export const { setToken, logout } = slice.actions;
export default slice.reducer;
