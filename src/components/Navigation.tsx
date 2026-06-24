import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Trash2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth(); // authentication state

  const navItems = [
    { path: "/", label: "Início" },
    { path: "/about", label: "Sobre" },
    { path: "/services", label: "Serviços" },
    { path: "/pricing", label: "Preços" },
    { path: "/contact", label: "Contato" },
    { path: "/home", label: "Minhas Tarefas" },
    // Show Lixeira only when a user is logged in
    ...(user ? [{ path: "/trash", label: "Lixeira" }] : []),
  ];

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-foreground">Meu App</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Trash icon button for logged‑in users */}
            {user && (
              <Link
                to="/trash"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === "/trash"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                aria-label="Lixeira"
              >
                <Trash2 className="h-5 w-5" />
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                    location.pathname === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobile trash icon */}
              {user && (
                <Link
                  to="/trash"
                  className={cn(
                    "text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                    location.pathname === "/trash"
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                  aria-label="Lixeira"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Lixeira
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;