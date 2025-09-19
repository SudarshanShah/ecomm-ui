import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { token, logout, groups } = useAuth();
  const { totalQuantity } = useCart();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">ANN Traders</h1>
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} hover:bg-accent hover:text-accent-foreground transition-colors duration-200`}
                  >
                    <Link to="/" className="px-4 py-2 rounded-md">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {token && groups?.includes("admin") && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={`${navigationMenuTriggerStyle()} hover:bg-accent hover:text-accent-foreground transition-colors duration-200`}
                    >
                      <Link to="/add-product" className="px-4 py-2 rounded-md">
                        Add Product
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {token && <button
              onClick={() => navigate('/cart')}
              className="relative inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs h-5 min-w-5 px-1">
                  {totalQuantity}
                </span>
              )}
            </button>}
          {token ? (
            <>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 cursor-pointer"
                onClick={handleLogin}
              >
                Sign In
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                onClick={handleRegister}
              >
                Get Started
              </Button>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
