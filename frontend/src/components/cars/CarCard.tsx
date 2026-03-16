import { Link } from "react-router-dom";
import type { Car } from "@/types/api.types";
import { formatCurrency } from "@/utils/formatters";

type Props = { car: Car };

export default function CarCard({ car }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="aspect-[16/10] bg-slate-200">
        {car.primaryPhoto ? <img src={car.primaryPhoto} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" /> : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{car.make} {car.model}</h3>
        <p className="text-sm text-slate-600">{car.city} • {car.year}</p>
        <p className="mt-2 text-sm">{formatCurrency(car.pricePerDay)} / day</p>
        <Link to={`/cars/${car.id}`} className="mt-3 inline-block rounded bg-brand-600 px-3 py-1 text-sm text-white">View</Link>
      </div>
    </article>
  );
}
