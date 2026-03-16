import { useSearchParams } from "react-router-dom";
import CarFilters from "@/components/cars/CarFilters";
import CarGrid from "@/components/cars/CarGrid";
import EmptyState from "@/components/shared/EmptyState";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Pagination from "@/components/shared/Pagination";
import { useCars } from "@/hooks/cars/useCars";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  const query = {
    city: params.get("city") ?? undefined,
    pickupDate: params.get("pickupDate") ?? undefined,
    returnDate: params.get("returnDate") ?? undefined,
    type: params.get("type") ?? undefined,
    transmission: params.get("transmission") ?? undefined,
    page: Number(params.get("page") ?? 1),
    limit: Number(params.get("limit") ?? 20)
  };

  const carsQuery = useCars(query);
  const cars = carsQuery.data?.data ?? [];
  const meta = carsQuery.data?.meta;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <CarFilters filters={params} onChange={(next) => setParams(next)} />
      <div>
        {carsQuery.isLoading ? <LoadingSpinner /> : null}
        {!carsQuery.isLoading && cars.length === 0 ? <EmptyState title="No cars found matching your criteria" /> : null}
        {cars.length > 0 ? <CarGrid cars={cars} /> : null}
        {meta ? (
          <Pagination
            total={meta.total}
            page={meta.page}
            limit={meta.limit}
            onPageChange={(page) => {
              const next = new URLSearchParams(params);
              next.set("page", String(page));
              setParams(next);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
