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
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
      <p className="mb-2">We sent an OTP to: <b>{email}</b></p>
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <form onSubmit={handleVerify} className="space-y-3">
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border p-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white p-2 rounded">Verify</button>
      </form>
      <button onClick={handleResend} className="mt-3 w-full border p-2 rounded">
        Resend OTP
      </button>
    </div>
  );
}
