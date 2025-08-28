'use client';
import { Provider } from 'react-redux';
import store from '../../lib/store';
import { 
  useNotificationsQuery, 
  useMarkReadMutation, 
  useDeleteNotificationMutation
} from '../../lib/api';

function Inner() {
  const { data } = useNotificationsQuery();
  const [markRead] = useMarkReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-3 py-1 rounded"
        >
          ← Back
        </button>
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="space-y-3">
        {data?.map((n: any) => (
          <div
            key={n._id}
            className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium break-words">
                {n.actorDisplayName ? (
                  <span>{n.actorDisplayName} <span className="text-xs text-gray-400">• {n.type}</span></span>
                ) : (
                  <span>{n.actorId || n.type}</span>
                )}
              </div>
              <div className="text-sm text-gray-500 break-words">
                {n.message}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {!n.read && (
                <button
                  className="btn text-sm px-3 py-1"
                  onClick={() => markRead({ id: n._id })}
                >
                  Mark read
                </button>
              )}
              <button
                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900"
                onClick={() => deleteNotification({ id: n._id })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Provider store={store}>
      <Inner />
    </Provider>
  );
}
