import { Link } from "react-router-dom";
import { useMyAgencyCars } from "@/hooks/cars/useMyAgencyCars";
import type { Car } from "@/types/api.types";
import { formatCurrency } from "@/utils/formatters";

function StatusBadge({ car }: { car: Car }) {
  const rented = car.rentalStatus === "RENTED" || car.currentlyRented;
  return (
    <span
      className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${
        rented ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
      }`}
    >
      {rented ? "Rented" : "Available"}
    </span>
  );
}

export default function ListingsPage() {
  const cars = useMyAgencyCars({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link className="rounded bg-brand-600 px-3 py-2 text-sm text-white" to="/agency/listings/new">Add listing</Link>
      </div>
      {cars.isLoading ? <div className="rounded border bg-white p-4">Loading your listings...</div> : null}
      {!cars.isLoading && (cars.data?.data ?? []).length === 0 ? (
        <div className="rounded border bg-white p-4">No listings yet for this agency.</div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cars.data?.data ?? []).map((car) => (
          <article key={car.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="aspect-[16/10] bg-slate-200">
              {car.primaryPhoto ? (
                <img src={car.primaryPhoto} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">
                  {car.make} {car.model}
                </h3>
                <StatusBadge car={car} />
              </div>
              <p className="text-sm text-slate-600">
                {car.city} • {car.year}
              </p>
              <p className="text-sm">{formatCurrency(car.pricePerDay)} / day</p>
              <div className="flex gap-2 pt-1">
                <Link to={`/cars/${car.id}`} className="rounded border px-3 py-1 text-sm">
                  View
                </Link>
                <Link to={`/agency/listings/${car.id}/edit`} className="rounded bg-brand-600 px-3 py-1 text-sm text-white">
                  Edit
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
