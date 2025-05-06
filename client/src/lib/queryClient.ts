import { QueryClient, QueryFunction, QueryCache, MutationCache } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  try {
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
  } catch (error) {
    console.error("Error in API response:", error);
    // Re-throw the error so it can be handled by the caller
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Request Error (${method} ${url}):`, error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      
      try {
        return await res.json();
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        // Return empty object if JSON parsing fails
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${queryKey[0]}:`, error);
      // Re-throw to allow React Query to handle it
      throw error;
    }
  };

// Create a query client with error handling
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error('Query error:', error);
      // You could add global error notification here if needed
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error('Mutation error:', error);
      // You could add global error notification here if needed
    },
  }),
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false
    },
    mutations: {
      retry: false,
    },
  },
});
