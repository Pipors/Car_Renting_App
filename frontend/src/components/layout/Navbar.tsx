import { Link, useNavigate } from "react-router-dom";
import { Car, LogOut, LayoutDashboard, BookOpen, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Car className="h-6 w-6 text-primary" />
          <span>CarRental</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "AGENCY" ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/agency/dashboard">
                      <LayoutDashboard className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/agency/cars/new">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Car
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/agency/bookings">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Bookings
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/cars">
                      <Car className="h-4 w-4 mr-1" />
                      Browse Cars
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/renter/bookings">
                      <BookOpen className="h-4 w-4 mr-1" />
                      My Bookings
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/renter/reputation">
                      <Star className="h-4 w-4 mr-1" />
                      My Reputation
                    </Link>
                  </Button>
                </>
              )}
              <span className="text-sm text-muted-foreground px-2">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
