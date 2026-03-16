import { useState } from "react";
import { apiClient } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.post("/auth/forgot-password", { email });
    setDone(true);
  };

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Forgot password</h1>
      {done ? <p className="mt-3 text-sm">Check your email for OTP instructions.</p> : null}
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button className="w-full rounded bg-brand-600 py-2 text-white" type="submit">Send OTP</button>
      </form>
    </div>
  );
}
