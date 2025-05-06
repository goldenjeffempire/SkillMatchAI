import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/error-boundary";
import { AIChatbot } from "@/components/ai-chatbot";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BrandingPage from "@/pages/branding-page";
import CheckoutPage from "@/pages/checkout-page";
import SubscriptionPage from "@/pages/subscription-page";
import SuccessPage from "@/pages/success-page";
import ProjectsPage from "@/pages/projects-page";
import ProjectDetailPage from "@/pages/project-detail-page";
import AIStudioPage from "@/pages/ai-studio-page";
import DashboardPage from "@/pages/dashboard-page";
import SocialPage from "@/pages/social-page";
import LibraryPage from "@/pages/library-page";
import { ProtectedRoute } from "@/lib/protected-route";
import UsersPage from "./pages/users-page"; // Added import


function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/branding" component={BrandingPage} />
      <Route path="/subscription" component={SubscriptionPage} />

      {/* Protected Routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/social" component={SocialPage} />
      <ProtectedRoute path="/library" component={LibraryPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/success" component={SuccessPage} />
      <ProtectedRoute path="/projects" component={ProjectsPage} />
      <ProtectedRoute path="/projects/:id" component={ProjectDetailPage} />
      <ProtectedRoute path="/ai-studio" component={AIStudioPage} />
      <ProtectedRoute path="/users" component={UsersPage} /> {/* Added route */}
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/products" component={ProductsPage} />
      <ProtectedRoute path="/customers" component={CustomersPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />

      <Route component={NotFound} />
    </Switch>
  );
}

// Global error handler component with access to toast context
function GlobalErrorHandler() {
  const { toast } = useToast();

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      console.error('Unhandled promise rejection:', event.reason);

      // Show a toast notification to inform the user
      toast({
        title: "Application Error",
        description: "Something went wrong. Please try again or refresh the page.",
        variant: "destructive",
      });
    };

    // Add the event listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  return null;
}

// AI Chatbot wrapper that conditionally shows the chatbot based on the current route
function AIChatbotWrapper() {
  const [location] = useLocation();

  // Don't show chatbot on auth page
  const hideChatbotOnRoutes = ["/auth"];
  const shouldHideChatbot = hideChatbotOnRoutes.some(route => location === route);

  if (shouldHideChatbot) {
    return null;
  }

  return <AIChatbot />;
}

const routes = {
  dashboard: {
    path: '/dashboard',
    roles: ['user', 'admin', 'business', 'educator'],
  },
  social: {
    path: '/social',
    roles: ['user', 'admin'],
  },
  aiStudio: {
    path: '/ai-studio',
    roles: ['user', 'admin', 'business'],
  },
  library: {
    path: '/library',
    roles: ['user', 'admin', 'educator'],
  },
  courses: {
    path: '/courses',
    roles: ['user', 'admin', 'educator'],
  },
  marketplace: {
    path: '/marketplace',
    roles: ['user', 'admin', 'business'],
  },
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="echoverse-theme">
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <GlobalErrorHandler />
              <Router />
              <AIChatbotWrapper />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;