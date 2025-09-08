"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "../../lib/api";
import { useDispatch } from "react-redux";
import { api } from "../../store/api";
import { reconnectSocket } from "../../lib/socket";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form);
      localStorage.setItem("token", data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      dispatch(api.util.resetApiState());
      try { reconnectSocket(); } catch {}
      // Notify listeners (same-tab) to refetch profile/unread
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('auth-changed'));
      router.push("/");
    } catch (err: any) {
      if (err.message.includes("verify")) {
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-20 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition">
          Login
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <Link href="/signup" className="hover:underline">
          Create an account
        </Link>
        <Link href="/reset-password" className="text-black font-semibold hover:underline">
          Reset Password
        </Link>
      </div>
    </div>
  );
}
