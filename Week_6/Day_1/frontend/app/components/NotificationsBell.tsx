'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from './NotificationsProvider';

export default function NotificationsBell() {
  const { unread } = useNotifications();
  return (
    <Link href="/notifications" className="relative inline-flex items-center justify-center p-2 hover:opacity-80">
      <Bell size={22} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  );
}
