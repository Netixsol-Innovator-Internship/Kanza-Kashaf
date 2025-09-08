"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { verifyOtp, resendOtp } from "../../lib/api";

export default function VerifyOtpPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await verifyOtp(email, otp);
      setMessage("Verified successfully! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      await resendOtp(email);
      setMessage("OTP resent! Check your email.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Verify OTP</h1>
      <p className="mb-2 text-gray-700">
        We sent an OTP to: <b className="text-black">{email}</b>
      </p>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      <form onSubmit={handleVerify} className="space-y-3">
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-black"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition"
        >
          Verify
        </button>
      </form>
      <button
        onClick={handleResend}
        className="mt-3 w-full border border-gray-400 p-2 rounded hover:bg-gray-100 transition"
      >
        Resend OTP
      </button>
    </div>
  );
}
