import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth.store";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, reset } = useForm({ defaultValues: user ?? {} as any });

  useEffect(() => {
    reset(user ?? {} as any);
  }, [reset, user]);

  return (
    <div className="max-w-xl rounded border bg-white p-4">
      <h1 className="text-xl font-bold">Profile</h1>
      <form
        className="mt-3 space-y-2"
        onSubmit={handleSubmit(async (values) => {
          const res = await apiClient.put("/users/me", values);
          if (user) setAuth({ ...user, ...res.data.data }, useAuthStore.getState().accessToken ?? "");
        })}
      >
        <input className="w-full rounded border px-3 py-2" placeholder="First name" {...register("firstName")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Last name" {...register("lastName")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Phone" {...register("phone")} />
        <button className="rounded bg-brand-600 px-3 py-2 text-white" type="submit">Save</button>
      </form>
    </div>
  );
}
