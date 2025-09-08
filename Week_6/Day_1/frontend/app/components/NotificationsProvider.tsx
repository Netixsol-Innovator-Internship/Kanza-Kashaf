'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSocket } from '../../lib/socket';
import toast, { Toaster } from 'react-hot-toast';
import { useGetProfileQuery } from '../../store/api';

type NotifContextType = {
  unread: number;
  setUnread: React.Dispatch<React.SetStateAction<number>>;
  refreshCount: () => Promise<void>;
};

const NotificationsContext = createContext<NotifContextType | undefined>(undefined);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within <NotificationsProvider>');
  return ctx;
}

export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [unread, setUnread] = useState(0);
  const { data: profile } = useGetProfileQuery();

  const fetchUnread = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUnread(0);
        return;
      }
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const list = await res.json();
      const count = Array.isArray(list) ? list.filter((n: any) => !n.read).length : 0;
      setUnread(count);
    } catch (e) {
      console.warn('[notifications] fetchUnread failed:', e);
    }
  };

  useEffect(() => { fetchUnread(); }, [profile?.id]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') fetchUnread();
    };
    if (typeof window !== 'undefined') window.addEventListener('storage', onStorage);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('storage', onStorage); };
  }, []);

  useEffect(() => {
    const onAuthChanged = () => { fetchUnread(); };
    if (typeof window !== 'undefined') window.addEventListener('auth-changed', onAuthChanged as any);
    return () => { if (typeof window !== 'undefined') window.removeEventListener('auth-changed', onAuthChanged as any); };
  }, []);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;
    const onConnect = () => { fetchUnread(); };
    s.on('connect', onConnect);
    return () => { s.off('connect', onConnect); };
  }, []);

  useEffect(() => {
    const s = getSocket();
    if (!s) return;

    const handler = (event: string, payload: any) => {
      if (event !== 'notification') return;
      const title = payload?.title || payload?.type || 'Notification';
      const message = payload?.message;
      if (!message) return;
      toast.custom((t) => (
        <div className="bg-white shadow-lg rounded-2xl p-4 w-80 border">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{message}</div>
        </div>
      ), { position: 'top-right', duration: 5000 });
      setUnread((c) => c + 1);
    };

    const onAny = (evt: string, payload: any) => handler(evt, payload);
    s.onAny(onAny);

    return () => {
      s.offAny(onAny);
    };
  }, []);

  const value = useMemo(() => ({
    unread, setUnread, refreshCount: fetchUnread,
  }), [unread]);

  return (
    <NotificationsContext.Provider value={value}>
      <Toaster />
      {children}
    </NotificationsContext.Provider>
  );
}
