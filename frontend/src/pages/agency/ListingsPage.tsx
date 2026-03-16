import { Link } from "react-router-dom";
import CarGrid from "@/components/cars/CarGrid";
import { useCars } from "@/hooks/cars/useCars";

export default function ListingsPage() {
  const cars = useCars({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link className="rounded bg-brand-600 px-3 py-2 text-sm text-white" to="/agency/listings/new">Add listing</Link>
      </div>
      <CarGrid cars={cars.data?.data ?? []} />
    </div>
  );
}
