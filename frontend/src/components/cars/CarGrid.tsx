import type { Car } from "@/types/api.types";
import CarCard from "./CarCard";

type Props = { cars: Car[] };

export default function CarGrid({ cars }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
