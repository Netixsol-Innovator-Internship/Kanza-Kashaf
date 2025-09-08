'use client';

import { useGetMyNotificationsQuery, useMarkNotificationReadMutation } from '../../store/api';
import { useNotifications } from '../components/NotificationsProvider';
import { Button } from '../components/ui/Button2';
import Link from 'next/link';

export default function NotificationsPage() {
  const { data, isLoading, refetch } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const { refreshCount } = useNotifications();

  const handleRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
      refreshCount();
      refetch();
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  };

  const handleReadAll = async () => {
    if (!data) return;
    try {
      await Promise.all(
        data
          .filter((n) => !n.read)
          .map((n) => markRead(n._id).unwrap())
      );
      refreshCount();
      refetch();
    } catch (err) {
      console.error('Error marking all notifications read', err);
    }
  };

  if (isLoading) return <div className="p-6">Loading notifications...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <Button onClick={handleReadAll} variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>
      <div className="space-y-4">
        {data && data.length > 0 ? (
          data.map((n) => (
            <div
              key={n._id}
              className={`p-4 border rounded-lg shadow-sm ${
                n.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-medium">{n.title}</h2>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  {n.meta?.productId && (
                    <Link
                      href={`/products/${n.meta.productId}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View product
                    </Link>
                  )}
                </div>
                {!n.read && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRead(n._id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No notifications found.</p>
        )}
      </div>
    </div>
  );
}
