import React from "react";
import Link from "next/link";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Plane, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-accent transition-colors">
              <Plane className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">TripGeniee</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/plan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">AI Planner</Link>
            <Link href="/trips" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Trips</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="/plan" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Start Planning
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-md absolute w-full p-4 flex flex-col gap-4 shadow-lg">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-base font-medium px-2 py-1.5 hover:bg-muted rounded-md">Home</Link>
            <Link href="/plan" onClick={() => setIsMenuOpen(false)} className="text-base font-medium px-2 py-1.5 hover:bg-muted rounded-md">AI Planner</Link>
            <Link href="/trips" onClick={() => setIsMenuOpen(false)} className="text-base font-medium px-2 py-1.5 hover:bg-muted rounded-md">My Trips</Link>
            <Link href="/plan" onClick={() => setIsMenuOpen(false)} className="bg-primary text-primary-foreground text-center py-2 rounded-md font-medium mt-2">
              Start Planning
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t bg-muted/30 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Plane className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg">TripGeniee</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your intelligent travel companion. We turn hours of research into a perfectly crafted itinerary in seconds.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm">Product</h4>
              <Link href="/plan" className="text-sm text-muted-foreground hover:text-foreground">AI Planner</Link>
              <Link href="/trips" className="text-sm text-muted-foreground hover:text-foreground">Saved Trips</Link>
              <span className="text-sm text-muted-foreground cursor-pointer">Pricing</span>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <span className="text-sm text-muted-foreground cursor-pointer">About Us</span>
              <span className="text-sm text-muted-foreground cursor-pointer">Careers</span>
              <span className="text-sm text-muted-foreground cursor-pointer">Contact</span>
            </div>
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <h4 className="font-semibold text-sm">Legal</h4>
              <span className="text-sm text-muted-foreground cursor-pointer">Privacy Policy</span>
              <span className="text-sm text-muted-foreground cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} TripGeniee. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
