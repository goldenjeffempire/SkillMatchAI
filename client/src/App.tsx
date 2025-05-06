import { StrictMode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/error-boundary";
import { AIChatbot } from "@/components/ai-chatbot";

// Pages
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import DashboardPage from "./pages/dashboard-page";
import SettingsPage from "./pages/settings-page";
import AiStudioPage from "./pages/ai-studio-page";
import ProjectsPage from "./pages/projects-page";
import ProjectDetailPage from "./pages/project-detail-page";
import LibraryPage from "./pages/library-page";
import NotFound from "./pages/not-found";
import CheckoutPage from "@/pages/checkout-page";
import SubscriptionPage from "@/pages/subscription-page";
import SuccessPage from "@/pages/success-page";
import UsersPage from "@/pages/users-page";
import EchoWriterPage from "@/pages/echo-writer-page";
import EchoBuilderPage from "@/pages/echo-builder-page";
import EchoMarketerPage from "@/pages/echo-marketer-page";
import EchoDevPage from "@/pages/echo-dev-page";
import ProductsPage from "@/pages/products-page";
import CustomersPage from "@/pages/customers-page";
import ProfilePage from "@/pages/profile-page";
import BooksPage from "@/pages/books-page";
import EchoTeacherPage from "@/pages/echo-teacher-page";
import GuardianAIPage from "@/pages/guardian-ai-page";
import BrandingPage from "@/pages/branding-page";
import SocialPage from "@/pages/social-page";

// Protected route wrapper
import { ProtectedRoute } from "./lib/protected-route";

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


export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Router>
                <Switch>
                  <Route path="/" component={HomePage} />
                  <Route path="/auth" component={AuthPage} />
                  <Route path="/branding" component={BrandingPage} />
                  <Route path="/subscription" component={SubscriptionPage} />
                  <Route path="/dashboard">
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/social">
                    <ProtectedRoute>
                      <SocialPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/library">
                    <ProtectedRoute>
                      <LibraryPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/checkout">
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/echo-builder">
                    <ProtectedRoute>
                      <EchoBuilderPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/echo-writer">
                    <ProtectedRoute>
                      <EchoWriterPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/echo-marketer">
                    <ProtectedRoute>
                      <EchoMarketerPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/echo-teacher">
                    <ProtectedRoute>
                      <EchoTeacherPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/books">
                    <ProtectedRoute>
                      <BooksPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/success">
                    <ProtectedRoute>
                      <SuccessPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/projects">
                    <ProtectedRoute>
                      <ProjectsPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/projects/:id">
                    <ProtectedRoute>
                      <ProjectDetailPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/ai-studio">
                    <ProtectedRoute>
                      <AiStudioPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/users">
                    <ProtectedRoute>
                      <UsersPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/settings">
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/products">
                    <ProtectedRoute>
                      <ProductsPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/customers">
                    <ProtectedRoute>
                      <CustomersPage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/profile">
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  </Route>
                  <Route path="/echo-dev" component={EchoDevPage} />
                  <Route path="/guardian-ai" component={GuardianAIPage} />
                  <Route component={NotFound} />
                </Switch>
              </Router>
              <Toaster />
              <GlobalErrorHandler />
              <AIChatbotWrapper />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}