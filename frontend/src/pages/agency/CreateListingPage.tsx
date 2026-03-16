import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CarPhotoUpload from "@/components/cars/CarPhotoUpload";
import { useCreateCar } from "@/hooks/cars/useCreateCar";

export default function CreateListingPage() {
  const navigate = useNavigate();
  const createCar = useCreateCar();
  const [files, setFiles] = useState<File[]>([]);
  const { register, handleSubmit } = useForm<any>({ defaultValues: { type: "sedan", transmission: "automatic", fuelType: "petrol" } });

  return (
    <div className="max-w-2xl rounded border bg-white p-4">
      <h1 className="text-xl font-bold">Create listing</h1>
      <form
        className="mt-3 space-y-2"
        onSubmit={handleSubmit(async (values) => {
          await createCar.mutateAsync({ ...values, photos: files });
          navigate("/agency/listings");
        })}
      >
        <input className="w-full rounded border px-3 py-2" placeholder="Make" {...register("make")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Model" {...register("model")} />
        <input className="w-full rounded border px-3 py-2" type="number" placeholder="Year" {...register("year")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Type" {...register("type")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Transmission" {...register("transmission")} />
        <input className="w-full rounded border px-3 py-2" placeholder="Fuel Type" {...register("fuelType")} />
        <input className="w-full rounded border px-3 py-2" type="number" placeholder="Seats" {...register("seats")} />
        <input className="w-full rounded border px-3 py-2" type="number" step="0.01" placeholder="Price per day" {...register("pricePerDay")} />
        <input className="w-full rounded border px-3 py-2" type="number" step="0.01" placeholder="Deposit" {...register("depositAmount")} />
        <input className="w-full rounded border px-3 py-2" placeholder="City" {...register("city")} />
        <CarPhotoUpload files={files} onFiles={setFiles} />
        <button className="rounded bg-brand-600 px-3 py-2 text-white" type="submit">Create</button>
      </form>
    </div>
  );
}
