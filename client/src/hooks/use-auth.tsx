import { create } from "zustand";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "./use-toast";

interface AuthState {
  user: any | null;
  setUser: (user: any | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export function useAuth() {
  const { toast } = useToast();
  const { user, setUser } = useAuthStore();

  // Query current user
  const { isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        return data;
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        return null;
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        return data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast({
        title: "Goodbye!",
        description: "You have been logged out.",
      });
    },
  });

  return {
    user,
    isLoading,
    loginMutation,
    logoutMutation,
    isAuthenticated: !!user,
  };
}