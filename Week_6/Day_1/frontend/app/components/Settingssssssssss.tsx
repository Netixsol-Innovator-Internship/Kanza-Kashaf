"use client";
import { useState } from "react";
import { useResetPasswordMutation } from "../../store/api";

const Settings = ({ user }: { user: any }) => {
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleChangePassword = async () => {
    try {
      await resetPassword({
        email: user.email,   // logged-in user’s email
        code,
        newPassword: newPass,
      }).unwrap();

      alert("✅ Password updated successfully!");
      setCode("");
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
          type="text"
          placeholder="Verification Code"
          className="border px-3 py-2 rounded w-full"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
