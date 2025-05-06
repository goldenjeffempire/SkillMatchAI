
import { useToast } from "./use-toast";

export function useNotifications() {
  const { toast } = useToast();

  const showNotification = (
    title: string,
    description?: string,
    variant: "default" | "destructive" = "default"
  ) => {
    toast({
      title,
      description,
      variant,
    });
  };

  return {
    success: (title: string, description?: string) => showNotification(title, description),
    error: (title: string, description?: string) => 
      showNotification(title, description, "destructive"),
    info: (title: string, description?: string) => showNotification(title, description),
  };
}
