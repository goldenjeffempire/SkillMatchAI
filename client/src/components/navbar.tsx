import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard", requiresAuth: true },
    { href: "/projects", label: "My Projects", requiresAuth: true },
    { href: "/ai-studio", label: "AI Studio", requiresAuth: true },
    { href: "/library", label: "Library", requiresAuth: true },
    { href: "/subscription", label: "Pricing" },
    { href: "/branding", label: "Branding" }
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <Logo />
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            // Don't show links that require auth if user is not logged in
            if (link.requiresAuth && !user) return null;
            
            return (
              <Link key={link.href} href={link.href}>
                <div className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:block text-sm text-gray-300">
                Welcome, {user.username}
              </div>
              <Button
                variant="outline"
                className="hidden md:block"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" className="hidden md:block">
                  Log In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="shadow-glow">
                  Get Started
                </Button>
              </Link>
            </>
          )}
          
          <button 
            className="md:hidden text-white"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-primary/20"
          >
            <nav className="container mx-auto px-4 py-5 flex flex-col space-y-4">
              {navLinks.map((link) => {
                // Don't show links that require auth if user is not logged in
                if (link.requiresAuth && !user) return null;
                
                return (
                  <Link key={link.href} href={link.href}>
                    <div 
                      className="text-gray-300 hover:text-white transition-colors py-2 cursor-pointer"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <div className="text-sm text-gray-300 py-2">
                    Welcome, {user.username}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={closeMenu}
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button 
                      className="w-full shadow-glow"
                      onClick={closeMenu}
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
