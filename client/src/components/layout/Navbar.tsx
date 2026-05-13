import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  Moon,
  Sun,
  Github,
  Trophy,
  Home,
  ScanSearch,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme.store";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/secrets", label: "Scanner", icon: ScanSearch },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export const Navbar = () => {
  const { resolvedTheme, setTheme } = useThemeStore();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 group shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-foreground">
            <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-background" />
          </div>
          <span className="text-sm font-semibold tracking-tight">sekreets</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors tracking-tight",
                pathname === to
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {to === "/leaderboard" && (
                <Icon className="h-3.5 w-3.5 shrink-0" />
              )}
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <a
            href="https://github.com/sekreets"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="ghost" size="icon" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </Button>
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav className="sm:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg z-50">
          <div className="mx-auto max-w-7xl px-3 py-2 flex flex-col gap-0.5">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm tracking-tight transition-colors",
                  pathname === to
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
