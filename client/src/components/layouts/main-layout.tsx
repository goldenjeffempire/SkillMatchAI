import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import {
  Search,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const mainMenuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Social", href: "/social" },
    { label: "Library", href: "/library" },
    { label: "AI Studio", href: "/ai-studio" },
    { label: "Projects", href: "/projects" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo and Nav */}
          <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Logo variant="icon" className="h-8 w-8" />
                <span className="font-semibold text-lg hidden md:inline">Echoverse</span>
              </a>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {mainMenuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      location === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Search and User Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full h-9 rounded-md border border-border bg-background pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            
            <ModeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || ""} />
                    <AvatarFallback>
                      {getInitials(user?.fullName || user?.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Link href="/profile">
                    <a className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard">
                    <a className="flex items-center w-full">
                      <span>Dashboard</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">
                    <a className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo variant="icon" className="h-6 w-6" />
                <span className="font-semibold">Echoverse</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering you with integrated AI capabilities, social features, and learning tools.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Platform</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/dashboard">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-studio">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">AI Studio</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/library">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Library</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/social">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Social</a>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/about">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <a className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Subscribe</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with the latest features and updates.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Echoverse. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}