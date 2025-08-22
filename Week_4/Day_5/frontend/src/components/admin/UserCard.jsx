
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useChangeUserRoleMutation, useToggleBlockUserMutation } from "../../features/users/usersApi";

const roleLabel = (r) => r?.replace("superAdmin", "Super Admin").replace("admin", "Admin").replace("user", "User");

const UserCard = ({ user }) => {
  const me = useSelector(selectCurrentUser);
  const [changeRole, { isLoading: isChanging }] = useChangeUserRoleMutation();
  const [toggleBlock, { isLoading: isToggling }] = useToggleBlockUserMutation();

  const allowedTargetRoles = useMemo(() => {
    if (me?.role === "admin") return ["user", "admin"]; // can only set users -> admin or user
    if (me?.role === "superAdmin") return ["user", "admin"]; // cannot set superAdmin from here
    return [];
  }, [me?.role]);

  const canChangeThisUser = useMemo(() => {
    if (me?.role === "admin") return user.role === "user";
    if (me?.role === "superAdmin") return user._id !== me.id; // avoid self-demote via UI
    return false;
  }, [me, user]);

  const onRoleChange = async (e) => {
    const newRole = e.target.value;
    if (newRole === user.role) return;
    try {
      await changeRole({ id: user._id, role: newRole }).unwrap();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to change role");
    }
  };

  const onToggleBlock = async () => {
    try {
      await toggleBlock(user._id).unwrap();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to toggle block");
    }
  };

  return (
    <div className="w-full border rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700 flex items-center justify-between mb-3">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-semibold">
          {user.name?.slice(0,2)?.toUpperCase()}
        </div>
        <div>
          <div className="text-base font-semibold">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
          <div className="text-xs mt-1">
            Role: <span className="font-medium">{roleLabel(user.role)}</span>
            {user.isBlocked && <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Blocked</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <select
          className="px-3 py-2 rounded-xl border dark:bg-gray-950 dark:border-gray-700"
          value={user.role}
          onChange={onRoleChange}
          disabled={!canChangeThisUser || isChanging}
        >
          {allowedTargetRoles.map((r) => (
            <option key={r} value={r}>{roleLabel(r)}</option>
          ))}
        </select>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={user.isBlocked}
            onChange={onToggleBlock}
            disabled={!canChangeThisUser || isToggling}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 relative">
            <span className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
          </div>
          <span className="ml-2 text-sm">{user.isBlocked ? "Unblock" : "Block"}</span>
        </label>
      </div>
    </div>
  );
};

export default UserCard;
