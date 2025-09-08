"use client";

import { useState } from "react";
import { useResetPasswordMutation } from "../../store/api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleRequestOtp = () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    alert(`OTP sent to ${email}. Check your inbox.`);
  };

  const handleChangePassword = async () => {
    try {
      await resetPassword({ email, code, newPassword: newPass }).unwrap();
      alert("Password updated successfully!");
      setCode("");
      setNewPass("");
    } catch (err: any) {
      alert("Failed: " + (err?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-black">Reset Password</h2>
      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleRequestOtp}
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Send OTP
        </button>
        <input
          type="text"
          placeholder="Verification Code"
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-black"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:border-black"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50 transition"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
