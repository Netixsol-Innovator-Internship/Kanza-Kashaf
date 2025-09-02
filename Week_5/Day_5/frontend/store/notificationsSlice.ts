import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  list: Notification[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  list: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.list = state.list.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
