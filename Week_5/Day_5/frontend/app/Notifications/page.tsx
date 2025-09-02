"use client"

import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { markAllAsRead } from "../../store/notificationsSlice"
import Navbar2 from "../components/navbars/Navbar2"
import toast from "react-hot-toast"

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const { list, unreadCount } = useSelector(
    (state: RootState) => state.notifications
  )

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
    toast.success("All notifications marked as read ✅")
  }

  return (
    <>
      <Navbar2 />
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {list.map((n) => (
            <li
              key={n.id}
              className={`p-4 border rounded-lg shadow-sm ${
                n.read ? "bg-white" : "bg-indigo-50"
              }`}
            >
              <p className="font-medium">{n.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  )
}
