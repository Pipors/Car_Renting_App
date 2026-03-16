import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { carsService } from "@/services";

export function SearchCarsPage() {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    minPrice: "",
    maxPrice: "",
  });
  const [search, setSearch] = useState(filters);

  const { data: cars, isLoading } = useQuery({
    queryKey: ["cars", search],
    queryFn: () =>
      carsService.list({
        make: search.make || undefined,
        model: search.model || undefined,
        minPrice: search.minPrice ? Number(search.minPrice) : undefined,
        maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
        available: true,
      }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Browse Cars</h1>
        <p className="text-muted-foreground mt-1">Find your perfect rental</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
        <Input
          placeholder="Make (e.g. Toyota)"
          value={filters.make}
          onChange={(e) => setFilters((f) => ({ ...f, make: e.target.value }))}
          className="w-40"
        />
        <Input
          placeholder="Model"
          value={filters.model}
          onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
          className="w-40"
        />
        <Input
          placeholder="Min price"
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
          className="w-32"
        />
        <Input
          placeholder="Max price"
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          className="w-32"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </form>

      {isLoading && <p className="text-muted-foreground">Searching...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars?.map((car) => (
          <Card key={car.id} className="overflow-hidden">
            {car.imageUrl && (
              <img
                src={car.imageUrl}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    {car.make} {car.model}
                  </p>
                  <p className="text-sm text-muted-foreground">{car.year}</p>
                </div>
                <Badge variant={car.available ? "success" : "secondary"}>
                  {car.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${car.pricePerDay}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                  <p className="text-xs text-muted-foreground">
                    Deposit: ${car.depositAmount}
                  </p>
                </div>
              </div>
              {car.agency && (
                <p className="text-xs text-muted-foreground">
                  by {car.agency.companyName}
                </p>
              )}
              <Button className="w-full" asChild>
                <Link to={`/cars/${car.id}`}>View & Book</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && cars?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No cars found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
