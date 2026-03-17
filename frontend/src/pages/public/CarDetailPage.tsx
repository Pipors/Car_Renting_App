import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCar } from "@/hooks/cars/useCar";
import { formatCurrency } from "@/utils/formatters";

export default function CarDetailPage() {
  const { id } = useParams();
  const carQuery = useCar(id);
  const car = carQuery.data;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const photos = useMemo(() => {
    if (!car) return [] as string[];
    const fromPhotos = (car.photos ?? []).map((p) => p.url).filter(Boolean);
    if (fromPhotos.length > 0) return fromPhotos;
    return car.primaryPhoto ? [car.primaryPhoto] : [];
  }, [car]);

  const activePhoto = photos[activeImageIndex] ?? null;

  const moveCarousel = (direction: "prev" | "next") => {
    if (photos.length <= 1) return;
    setActiveImageIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? photos.length - 1 : current - 1;
      }
      return current === photos.length - 1 ? 0 : current + 1;
    });
  };

  if (!car) return <div className="rounded border bg-white p-4">Loading car...</div>;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-3 rounded-xl border bg-white p-4">
        <div className="relative overflow-hidden rounded-lg bg-slate-100">
          {activePhoto ? (
            <img src={activePhoto} alt={`${car.make} ${car.model}`} className="h-80 w-full object-cover" />
          ) : (
            <div className="flex h-80 items-center justify-center text-sm text-slate-500">No photos available</div>
          )}

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => moveCarousel("prev")}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded bg-black/60 px-3 py-1 text-sm text-white"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => moveCarousel("next")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-black/60 px-3 py-1 text-sm text-white"
              >
                Next
              </button>
            </>
          ) : null}
        </div>

        {photos.length > 1 ? (
          <div className="grid grid-cols-5 gap-2">
            {photos.map((photo, idx) => (
              <button
                type="button"
                key={`${photo}-${idx}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`overflow-hidden rounded border ${idx === activeImageIndex ? "border-brand-600" : "border-slate-200"}`}
              >
                <img src={photo} alt={`Car photo ${idx + 1}`} className="h-16 w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}

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
