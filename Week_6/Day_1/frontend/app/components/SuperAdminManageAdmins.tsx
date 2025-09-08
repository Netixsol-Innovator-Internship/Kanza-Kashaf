"use client"
import { useState } from "react"
import { useGetUsersQuery, useUpdateUserRoleMutation, useToggleUserBlockMutation } from "../../store/api"
import Switch from "./ui/Switch"
import Button from "./ui/Button"

const SuperAdminManageAdmins = () => {
  const { data: users, isLoading } = useGetUsersQuery()
  const [updateRole] = useUpdateUserRoleMutation()
  const [toggleBlock] = useToggleUserBlockMutation()

  // store error messages per user by ID
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  if (isLoading) return <p>Loading admins...</p>
  const admins = users?.filter((u) => u.role === "admin")

  const handleRoleChange = (user: any) => {
    if (user.blocked) {
      setErrors((prev) => ({
        ...prev,
        [user._id]: "You are not allowed to change role of blocked admin account",
      }))
      return
    }
    setErrors((prev) => ({ ...prev, [user._id]: null }))
    updateRole({ id: user._id, role: user.role === "admin" ? "user" : "admin" })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Admins</h1>
      {admins?.map((user) => (
        <div key={user._id} className="flex flex-col border rounded-xl p-4 bg-white gap-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm">Role: {user.role}</p>
              <p className="text-sm">Status: {user.blocked ? "Blocked" : "Active"}</p>
            </div>
            <div className="flex gap-4 items-center">
              <Button onClick={() => handleRoleChange(user)}>
                Change Role
              </Button>
              <div className="flex items-center gap-2">
                <span className={user.blocked ? "text-red-500" : "text-green-500"}>
                  {user.blocked ? "Blocked" : "Active"}
                </span>
                <Switch
                  checked={user.blocked}
                  onCheckedChange={(checked) => {
                    toggleBlock({ id: user._id, block: checked })
                    if (!checked) {
                      // ✅ clear error when user is activated
                      setErrors((prev) => ({ ...prev, [user._id]: null }))
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Inline error message */}
          {errors[user._id] && (
            <p className="text-sm text-red-500 mt-1">{errors[user._id]}</p>
          )}
        </div>
      ))}
    </div>
  )
}
export default SuperAdminManageAdmins
