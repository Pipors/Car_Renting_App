import { Link } from "react-router-dom";
import { Car, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

export function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Your Trusted Car Rental Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect agencies and renters with a transparent reputation system.
          Every rental builds trust across the platform.
        </p>
        <div className="flex gap-4 justify-center">
          {!user ? (
            <>
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/cars">Browse Cars</Link>
              </Button>
            </>
          ) : user.role === "AGENCY" ? (
            <Button size="lg" asChild>
              <Link to="/agency/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link to="/cars">Browse Cars</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Car className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Wide Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse hundreds of cars from verified agencies. Filter by make, model, and price.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Secure Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Deposits are processed via Stripe. Your payment information is always protected.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Star className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Reputation System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Agencies rate renters after every rental. Build your reputation and unlock better deals.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
