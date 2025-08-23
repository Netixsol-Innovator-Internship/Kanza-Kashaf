"use client"

import { useGetUsersQuery, useUpdateUserRoleMutation, useToggleUserBlockMutation } from "../redux/apiSlice"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import Switch from "../components/ui/Switch"

const SuperAdminManageAdmins = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [changeRole] = useUpdateUserRoleMutation()
  const [toggleBlock] = useToggleUserBlockMutation()

  if (isLoading) return <p className="p-4">Loading admins...</p>
  if (error) return <p className="p-4 text-red-500">Error loading admins</p>

  // Filter only admins
  const admins = users?.filter((user) => user.role === "admin")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

      <div className="space-y-4">
        {admins?.map((user) => (
          <Card key={user._id} className="flex items-center justify-between p-4 shadow-md rounded-xl border">
            
            {/* Left Section - User Info */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> {user.isBlocked ? "Blocked" : "Active"}
              </p>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              {/* Change Role */}
              <Button
                onClick={() =>
                  changeRole({
                    id: user._id,
                    role: user.role === "admin" ? "user" : "admin",
                  })
                }
              >
                Change Role
              </Button>

              {/* Block/Unblock Toggle */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium ${
                    user.isBlocked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
                <Switch
                  checked={user.isBlocked}
                  onCheckedChange={(checked) =>
                    toggleBlock({ id: user._id, block: checked })
                  }
                />
              </div>
            </div>
          </Card>
        ))}

        {admins?.length === 0 && (
          <p className="text-center p-4 text-gray-500">No admins found.</p>
        )}
      </div>
    </div>
  )
}

export default SuperAdminManageAdmins
