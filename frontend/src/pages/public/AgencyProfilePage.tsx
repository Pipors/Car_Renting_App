import { useParams } from "react-router-dom";
import CarGrid from "@/components/cars/CarGrid";
import { useAgencyReviews } from "@/hooks/reviews/useAgencyReviews";
import { useCars } from "@/hooks/cars/useCars";

export default function AgencyProfilePage() {
  const { id } = useParams();
  const cars = useCars({});
  const reviews = useAgencyReviews(id, {});

  return (
    <div className="space-y-4">
      <div className="rounded border bg-white p-4">
        <h1 className="text-2xl font-bold">Agency Profile</h1>
        <p className="text-sm text-slate-600">Agency id: {id}</p>
      </div>
      <h2 className="font-semibold">Cars</h2>
      <CarGrid cars={cars.data?.data ?? []} />
      <h2 className="font-semibold">Reviews ({reviews.data?.data?.length ?? 0})</h2>
    </div>
  );
}
