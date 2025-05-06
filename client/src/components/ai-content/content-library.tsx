import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, FileText, Loader2, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AiContent } from "@shared/schema";

interface ContentLibraryProps {
  onSelectContent?: (content: AiContent) => void;
}

export function ContentLibrary({ onSelectContent }: ContentLibraryProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: contents, isLoading, error } = useQuery<AiContent[]>({
    queryKey: ["/api/ai-contents", activeTab !== "all" ? activeTab : undefined],
    queryFn: async () => {
      try {
        const url = `/api/ai-contents${activeTab !== "all" ? `?type=${activeTab}` : ""}`;
        const response = await fetch(url, { credentials: 'include' });
        
        if (response.status === 401) {
          // Not authenticated, return empty array instead of throwing
          return [];
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch AI contents');
        }
        
        return await response.json();
      } catch (err) {
        console.error("Error fetching AI contents:", err);
        // Return empty array on error to avoid rendering issues
        return [];
      }
    },
    // Don't retry on failure
    retry: false
  });
  
  // Show error toast only once when there's an error
  // but don't throw it to prevent unhandled rejection
  useEffect(() => {
    if (error) {
      console.error("Content library error:", error);
      toast({
        title: "Error",
        description: "Failed to load your AI content library",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Function to get badge color based on content type
  const getBadgeVariant = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      blog: "default",
      marketing: "secondary",
      social: "default",
      email: "outline",
      product: "secondary",
      seo: "outline",
      creative: "default",
      technical: "outline",
    };
    
    return variants[type] || "default";
  };
  
  const handleSelectContent = (content: AiContent) => {
    if (onSelectContent) {
      onSelectContent(content);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content Library</CardTitle>
        <CardDescription>
          Your saved AI-generated content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4 grid grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="product">Product</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="creative">Creative</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !contents || contents.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No content items found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the AI Content Generator to create and save content
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contents.map((content) => (
                  <div 
                    key={content.id} 
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <p className="text-sm text-gray-500 mb-1">
                          Created {content.createdAt ? format(new Date(content.createdAt), 'MMM d, yyyy') : 'Recently'}
                        </p>
                      </div>
                      <Badge variant={getBadgeVariant(content.type)}>
                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm line-clamp-2 mb-3 text-gray-600 dark:text-gray-300">
                      {content.prompt}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleSelectContent(content)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-500">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}