import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "@/lib/axios";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState(params.get("otp") ?? "");
  const [newPassword, setNewPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    alert("Password reset successful");
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded border px-3 py-2" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />
        <input className="w-full rounded border px-3 py-2" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
        <button className="w-full rounded bg-brand-600 py-2 text-white" type="submit">Reset password</button>
      </form>
    </div>
  );
}
