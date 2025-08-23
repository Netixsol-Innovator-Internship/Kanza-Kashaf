"use client"

import { useGetUsersQuery, useUpdateUserRoleMutation, useToggleUserBlockMutation } from "../redux/apiSlice"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Switch from "../components/ui/Switch"

const ManageUsers = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [updateUserRole] = useUpdateUserRoleMutation()
  const [toggleUserBlock] = useToggleUserBlockMutation()

  if (isLoading) return <p className="p-4 text-gray-700 dark:text-gray-300">Loading users...</p>
  if (error) return <p className="p-4 text-red-500">Error loading users</p>

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap()
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleBlockToggle = async (userId, blockStatus) => {
    try {
      await toggleUserBlock({ id: userId, block: blockStatus }).unwrap()
    } catch (error) {
      console.error("Failed to toggle block:", error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 dark:bg-gray-900">
      <h1 className="text-2xl font-prosto font-bold mb-6 text-gray-800 dark:text-gray-100">
        Manage Users
      </h1>

      <div className="space-y-4">
        {users?.filter((u) => u.role === "user").map((user) => (
          <Card
            key={user._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            {/* User Info */}
            <div className="flex flex-col mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{user.name}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">Status:</span> {user.isBlocked ? "Blocked" : "Active"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <Button
                onClick={() => handleRoleChange(user._id, "admin")}
                disabled={user.role === "admin"}
              >
                Make Admin
              </Button>

              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    user.isBlocked
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
                <Switch
                  checked={user.isBlocked}
                  onCheckedChange={(checked) =>
                    handleBlockToggle(user._id, checked)
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ManageUsers
