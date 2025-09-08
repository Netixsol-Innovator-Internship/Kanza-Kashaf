"use client";
import { useState } from "react";
import { useUpdatePasswordMutation } from "../../store/api";

const Settings = ({ user }: { user: any }) => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleChangePassword = async () => {
    try {
      await updatePassword({
        oldPassword: oldPass,
        newPassword: newPass,
      }).unwrap();

      alert("✅ Password updated successfully!");
      setOldPass("");
      setNewPass("");
    } catch (err: any) {
      alert("❌ Failed: " + (err?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="password"
          placeholder="Old Password"
          className="border px-3 py-2 rounded w-full"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="border px-3 py-2 rounded w-full"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 hover:bg-gray-700"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
