import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "@/hooks/auth/useLogin";
import { loginSchema } from "@/types/schemas";

type FormValues = { email: string; password: string };

export default function LoginPage() {
  const login = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit((data) => login.mutate(data))}>
        <input className="w-full rounded border px-3 py-2" placeholder="Email" {...register("email")} />
        {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
        <input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" {...register("password")} />
        {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
        <button className="w-full rounded bg-brand-600 py-2 text-white" type="submit">{login.isPending ? "Signing in..." : "Sign in"}</button>
      </form>
      <div className="mt-3 text-sm">
        <Link className="text-brand-700 underline" to="/auth/forgot-password">Forgot password?</Link>
      </div>
      <div className="mt-1 text-sm">
        <Link className="text-brand-700 underline" to="/auth/register">Create account</Link>
      </div>
    </div>
  );
}
