import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRegister } from "@/hooks/auth/useRegister";
import { registerAgencySchema, registerRenterSchema } from "@/types/schemas";

type UserType = "RENTER" | "AGENCY";

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>("RENTER");
  const registerMutation = useRegister();
  const schema = userType === "AGENCY" ? registerAgencySchema : registerRenterSchema;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<any>({
    resolver: zodResolver(schema as any),
    shouldUnregister: true,
    defaultValues: {
      userType: "RENTER"
    }
  });

  useEffect(() => {
    setValue("userType", userType, { shouldValidate: true });
  }, [setValue, userType]);

  const onSubmit = (data: Record<string, unknown>) => {
    registerMutation.mutate({ ...data, userType });
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold">Create account</h1>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded border px-3 py-1" onClick={() => setUserType("RENTER")}>Renter</button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setUserType("AGENCY")}>Agency</button>
      </div>
      <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("userType")} />
        <input className="rounded border px-3 py-2" placeholder="First name" {...register("firstName")} />
        {errors.firstName ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.firstName.message)}</p> : null}
        <input className="rounded border px-3 py-2" placeholder="Last name" {...register("lastName")} />
        {errors.lastName ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.lastName.message)}</p> : null}
        <input className="rounded border px-3 py-2" placeholder="Email" {...register("email")} />
        {errors.email ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.email.message)}</p> : null}
        <input className="rounded border px-3 py-2" placeholder="Phone" {...register("phone")} />
        {errors.phone ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.phone.message)}</p> : null}
        <input className="rounded border px-3 py-2" type="password" placeholder="Password" {...register("password")} />
        {errors.password ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.password.message)}</p> : null}
        <input className="rounded border px-3 py-2" type="password" placeholder="Confirm password" {...register("confirmPassword")} />
        {errors.confirmPassword ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.confirmPassword.message)}</p> : null}
        {userType === "AGENCY" ? <input className="rounded border px-3 py-2" placeholder="Agency name" {...register("agencyName")} /> : null}
        {userType === "AGENCY" && errors.agencyName ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.agencyName.message)}</p> : null}
        {userType === "AGENCY" ? <input className="rounded border px-3 py-2" placeholder="Address" {...register("address")} /> : null}
        {userType === "AGENCY" && errors.address ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.address.message)}</p> : null}
        {userType === "AGENCY" ? <input className="rounded border px-3 py-2" placeholder="City" {...register("city")} /> : null}
        {userType === "AGENCY" && errors.city ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.city.message)}</p> : null}
        {userType === "AGENCY" ? <input className="rounded border px-3 py-2" placeholder="Country" {...register("country")} /> : null}
        {userType === "AGENCY" && errors.country ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.country.message)}</p> : null}
        {userType === "AGENCY" ? <input className="rounded border px-3 py-2" placeholder="License number" {...register("licenseNumber")} /> : null}
        {userType === "AGENCY" && errors.licenseNumber ? <p className="md:col-span-2 text-sm text-red-600">{String(errors.licenseNumber.message)}</p> : null}
        {registerMutation.error ? <p className="col-span-full text-sm text-red-600">Failed to create account. Please try again.</p> : null}
        <button className="col-span-full rounded bg-brand-600 py-2 text-white" type="submit">{registerMutation.isPending ? "Creating..." : "Register"}</button>
      </form>
    </div>
  );
}
