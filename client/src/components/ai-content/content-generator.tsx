import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentGeneratorProps {
  onComplete?: (contentId: number) => void;
}

export function ContentGenerator({ onComplete }: ContentGeneratorProps) {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [generatedContent, setGeneratedContent] = useState("");

  const generateMutation = useMutation({
    mutationFn: async (data: { 
      prompt: string; 
      type: string; 
      tone?: string;
      title?: string;
    }) => {
      try {
        // Use the new AI API endpoint for content generation
        const res = await apiRequest("POST", "/api/ai/generate", {
          prompt: data.prompt,
          type: data.type,
          tone: data.tone || "professional",
          title: data.title
        });
        
        // Handle authentication errors gracefully
        if (res.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to generate content",
            variant: "destructive",
          });
          throw new Error("Authentication required");
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to generate content");
        }
        
        // Parse the JSON response safely
        try {
          return await res.json();
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          throw new Error("Invalid response from server");
        }
      } catch (error: any) {
        console.error("Content generation error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (!data?.content) {
        toast({
          title: "Invalid response",
          description: "Received an invalid response from the server",
          variant: "destructive",
        });
        return;
      }
      
      setGeneratedContent(data.content);
      toast({
        title: "Content generated",
        description: "Your content has been successfully generated and saved.",
      });
      
      // Invalidate ai-contents queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/ai/contents"] });
      
      if (onComplete && data.id) {
        onComplete(data.id);
      }
    },
    onError: (error: Error) => {
      console.error("Content generation mutation error:", error);
      toast({
        title: "Failed to generate content",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate({
      prompt,
      type,
      tone,
      title: title || prompt.substring(0, 50),
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Generate high-quality content using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title (optional)
            </label>
            <Input
              id="title"
              placeholder="My awesome content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Content Type
              </label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Post</SelectItem>
                  <SelectItem value="marketing">Marketing Copy</SelectItem>
                  <SelectItem value="social">Social Media Post</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="product">Product Description</SelectItem>
                  <SelectItem value="seo">SEO Content</SelectItem>
                  <SelectItem value="creative">Creative Writing</SelectItem>
                  <SelectItem value="technical">Technical Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tone" className="text-sm font-medium">
                Tone
              </label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="informative">Informative</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={generateMutation.isPending || !prompt}
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </form>
        
        {generatedContent && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-medium">Generated Content</h3>
            <div className="p-4 rounded-md border bg-muted/50 whitespace-pre-wrap">
              {generatedContent}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}