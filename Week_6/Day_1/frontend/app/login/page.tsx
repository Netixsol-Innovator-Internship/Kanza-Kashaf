"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/api";
import { useDispatch } from "react-redux";
import { api } from "../../store/api"; // 👈 import api

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch(); // 👈 get dispatch
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(form);
      localStorage.setItem("token", data.accessToken);

      // 👇 Clear RTK Query cache so getProfile refetches with new token
      dispatch(api.util.resetApiState());

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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
