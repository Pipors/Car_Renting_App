import { Link, useParams } from "react-router-dom";
import { useCar } from "@/hooks/cars/useCar";
import { formatCurrency } from "@/utils/formatters";

export default function CarDetailPage() {
  const { id } = useParams();
  const carQuery = useCar(id);
  const car = carQuery.data;

  if (!car) return <div className="rounded border bg-white p-4">Loading car...</div>;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-3 rounded-xl border bg-white p-4">
        <h1 className="text-2xl font-bold">{car.make} {car.model}</h1>
        <p className="text-sm text-slate-600">{car.city} • {car.year}</p>
        <p className="text-sm">{car.type} • {car.transmission} • {car.fuelType}</p>
      </div>
      <aside className="space-y-3 rounded-xl border bg-white p-4">
        <p className="text-lg font-semibold">{formatCurrency(car.pricePerDay)} / day</p>
        <p className="text-sm text-slate-600">Deposit {formatCurrency(car.depositAmount)}</p>
        <Link to={`/renter/bookings/new?carId=${car.id}`} className="inline-block rounded bg-brand-600 px-3 py-2 text-sm text-white">Request to book</Link>
      </aside>
    </div>
  );
}
