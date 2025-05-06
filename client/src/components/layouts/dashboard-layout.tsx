import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Bell,
  Search,
  Menu,
  X,
  Settings,
  LogOut,
  User,
  Home,
  BookOpen,
  PenTool,
  LayoutGrid,
  BarChart2,
  MessageSquare,
  Users,
  ShoppingCart,
  Package,
  Calendar,
  Sparkles,
  Briefcase,
  GraduationCap,
  Heart,
  HelpCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  icon: ReactNode;
  label: string;
  href: string;
  roles?: string[];
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Close sidebar on location change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Define sidebar menu items with role-based access
  const mainMenuItems: SidebarItem[] = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <Sparkles size={20} />,
      label: "AI Studio",
      href: "/ai-studio",
    },
    {
      icon: <BookOpen size={20} />,
      label: "Learning Library",
      href: "/library",
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Analytics",
      href: "/analytics",
      roles: ["admin", "business", "marketer"],
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Social Feed",
      href: "/social",
    },
    {
      icon: <Users size={20} />,
      label: "Community",
      href: "/community",
    },
  ];

  // Role-specific menu items
  const roleSpecificItems: Record<string, SidebarItem[]> = {
    admin: [
      {
        icon: <LayoutGrid size={20} />,
        label: "Admin Panel",
        href: "/admin",
      },
      {
        icon: <Users size={20} />,
        label: "User Management",
        href: "/admin/users",
      },
      {
        icon: <Settings size={20} />,
        label: "System Settings",
        href: "/admin/settings",
      },
    ],
    business: [
      {
        icon: <ShoppingCart size={20} />,
        label: "E-Commerce",
        href: "/business/ecommerce",
      },
      {
        icon: <Package size={20} />,
        label: "Products",
        href: "/business/products",
      },
      {
        icon: <Users size={20} />,
        label: "Customers",
        href: "/business/customers",
      },
    ],
    marketer: [
      {
        icon: <PenTool size={20} />,
        label: "Campaigns",
        href: "/marketing/campaigns",
      },
      {
        icon: <BarChart2 size={20} />,
        label: "Performance",
        href: "/marketing/performance",
      },
      {
        icon: <Users size={20} />,
        label: "Audience",
        href: "/marketing/audience",
      },
    ],
    educator: [
      {
        icon: <GraduationCap size={20} />,
        label: "Courses",
        href: "/educator/courses",
      },
      {
        icon: <Users size={20} />,
        label: "Students",
        href: "/educator/students",
      },
      {
        icon: <Calendar size={20} />,
        label: "Schedule",
        href: "/educator/schedule",
      },
    ],
    student: [
      {
        icon: <GraduationCap size={20} />,
        label: "My Courses",
        href: "/student/courses",
      },
      {
        icon: <Calendar size={20} />,
        label: "Schedule",
        href: "/student/schedule",
      },
      {
        icon: <BarChart2 size={20} />,
        label: "Progress",
        href: "/student/progress",
      },
    ],
    parent: [
      {
        icon: <Heart size={20} />,
        label: "Child Accounts",
        href: "/parent/children",
      },
      {
        icon: <BarChart2 size={20} />,
        label: "Progress Report",
        href: "/parent/progress",
      },
      {
        icon: <Calendar size={20} />,
        label: "Activities",
        href: "/parent/activities",
      },
    ],
  };

  // Helper function to filter menu items based on user role
  const filterMenuItemsByRole = (items: SidebarItem[]): SidebarItem[] => {
    if (!user) return [];
    
    return items.filter(item => {
      // If no roles specified, show to everyone
      if (!item.roles) return true;
      
      // Check if user role is in allowed roles
      return item.roles.includes(user.role);
    });
  };

  // Get role-specific menu items based on user role
  const getRoleSpecificItems = (): SidebarItem[] => {
    if (!user) return [];
    return roleSpecificItems[user.role] || [];
  };

  // Common menu items for all roles
  const commonItems: SidebarItem[] = [
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Support",
      href: "/support",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
    },
  ];

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col",
          "lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        initial={false}
        animate={{ translateX: sidebarOpen ? 0 : -100 + "%" }}
        transition={{ duration: 0.2 }}
      >
        {/* Sidebar header with logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Logo variant="icon" className="h-8 w-8" />
              <span className="font-semibold text-lg">Echoverse</span>
            </a>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Sidebar content - scrollable */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {/* Main menu section */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Main Menu
            </h3>
            <ul className="space-y-1">
              {filterMenuItemsByRole(mainMenuItems).map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center px-4 py-2 text-sm rounded-md",
                        "hover:bg-accent hover:text-accent-foreground transition-colors",
                        location === item.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-foreground"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Role-specific menu section */}
          {getRoleSpecificItems().length > 0 && (
            <div className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} Tools
              </h3>
              <ul className="space-y-1">
                {getRoleSpecificItems().map((item, index) => (
                  <li key={index}>
                    <Link href={item.href}>
                      <a
                        className={cn(
                          "flex items-center px-4 py-2 text-sm rounded-md",
                          "hover:bg-accent hover:text-accent-foreground transition-colors",
                          location === item.href
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-foreground"
                        )}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Common menu section */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              General
            </h3>
            <ul className="space-y-1">
              {commonItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        "flex items-center px-4 py-2 text-sm rounded-md",
                        "hover:bg-accent hover:text-accent-foreground transition-colors",
                        location === item.href
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-foreground"
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar footer with user info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback>{getInitials(user?.fullName || user?.username)}</AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1 truncate">
              <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings size={16} />
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
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 lg:px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>

          {/* Search bar */}
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full h-9 rounded-md border border-border bg-background pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Right section: notifications, profile, etc */}
          <div className="ml-auto flex items-center space-x-2">
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
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}