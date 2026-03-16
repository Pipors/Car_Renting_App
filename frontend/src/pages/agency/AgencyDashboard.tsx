import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Car, BookOpen, Plus, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { carsService, bookingsService } from "@/services";
import { useAuthStore } from "@/store/auth.store";

export function AgencyDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: cars } = useQuery({
    queryKey: ["agency-cars"],
    queryFn: () => carsService.list(),
  });

  const { data: bookings } = useQuery({
    queryKey: ["agency-bookings"],
    queryFn: bookingsService.list,
  });

  const pendingBookings = bookings?.filter((b) => b.status === "PENDING") ?? [];
  const activeCars = cars?.filter((c) => c.available) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Car className="h-4 w-4" /> Total Cars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{cars?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{activeCars.length} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookings?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">{pendingBookings.length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4" /> Completed Rentals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {bookings?.filter((b) => b.status === "COMPLETED").length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/agency/cars/new">
            <Plus className="h-4 w-4 mr-2" /> Add New Car
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/agency/bookings">View All Bookings</Link>
        </Button>
      </div>

      {pendingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Bookings</h2>
          <div className="space-y-3">
            {pendingBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">
                      {booking.car?.make} {booking.car?.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startDate).toLocaleDateString()} –{" "}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Pending</Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/agency/bookings/${booking.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
