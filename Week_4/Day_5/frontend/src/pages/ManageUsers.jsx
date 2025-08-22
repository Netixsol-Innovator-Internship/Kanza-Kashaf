"use client"

import { useGetUsersQuery, useUpdateUserRoleMutation, useToggleUserBlockMutation } from "../redux/apiSlice"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Switch from "../components/ui/Switch"

const ManageUsers = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [updateUserRole] = useUpdateUserRoleMutation()
  const [toggleUserBlock] = useToggleUserBlockMutation()

  if (isLoading) return <p className="p-4">Loading users...</p>
  if (error) return <p className="p-4 text-red-500">Error loading users</p>

  const handleRoleChange = async (userId) => {
    try {
      await updateUserRole({ userId, role: "admin" }).unwrap()
    } catch (err) {
      console.error("Failed to update role:", err)
    }
  }

  const handleBlockToggle = async (userId, blocked) => {
    try {
      await toggleUserBlock({ userId, blocked }).unwrap()
    } catch (err) {
      console.error("Failed to toggle block:", err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="space-y-4">
        {users?.filter(u => u.role === "user").map(user => (
          <Card key={user.id} className="flex items-center justify-between p-4 shadow-md rounded-xl border">
            
            {/* Left Section - User Info */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {user.blocked ? "Blocked" : "Active"}
              </p>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Promote to Admin */}
              <Button
                onClick={() => handleRoleChange(user.id)}
                disabled={user.role === "admin"} // already admin
              >
                Make Admin
              </Button>

              {/* Block/Unblock Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm">{user.blocked ? "Blocked" : "Active"}</span>
                <Switch
                  checked={!user.blocked}
                  onCheckedChange={(checked) => handleBlockToggle(user.id, !checked)}
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
