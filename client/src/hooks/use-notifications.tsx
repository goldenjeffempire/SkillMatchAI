
import { useToast } from "./use-toast";

export function useNotifications() {
  const { toast } = useToast();

  return {
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "default",
      });
    },
    error: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "destructive",
      });
    },
    info: (title: string, description?: string) => {
      toast({
        title,
        description,
      });
    },
  };
}
