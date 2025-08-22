
import React, { useMemo } from "react";
import { useGetUsersQuery } from "../../features/users/usersApi";
import UserCard from "../../components/admin/UserCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";

const ManageUsers = ({ filterRole = "user" }) => {
  const { data, isLoading, isError } = useGetUsersQuery();
  const me = useSelector(selectCurrentUser);

  const filtered = useMemo(() => {
    const list = data?.data || [];
    if (filterRole === "user") return list.filter((u) => u.role === "user");
    if (filterRole === "admin") return list.filter((u) => u.role === "admin");
    return list;
  }, [data, filterRole]);

  if (isLoading) return <div className="p-4">Loading users...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to load users.</div>;

  const title = filterRole === "admin" ? "Manage Admins" : "Manage Users";

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-sm text-gray-500">Signed in as: {me?.email}</div>
      </div>
      <div className="space-y-3">
        {filtered.map((u) => (
          <UserCard key={u._id} user={u} />
        ))}
        {filtered.length === 0 && <div className="text-sm text-gray-500">No users found.</div>}
      </div>
    </div>
  );
};

export default ManageUsers;
