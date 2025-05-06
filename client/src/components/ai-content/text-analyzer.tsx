import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface TextAnalyzerProps {
  initialText?: string;
}

type AnalysisType = "sentiment" | "topics" | "readability" | "seo" | "general";

interface AnalysisResult {
  sentiment?: {
    score: number;
    assessment: string;
    positiveAspects?: string[];
    negativeAspects?: string[];
  };
  topics?: string[];
  readability?: {
    score: number;
    level: string;
    suggestions: string[];
  };
  seo?: {
    score: number;
    keywords: string[];
    suggestions: string[];
  };
  summary?: string;
  tone?: string;
  suggestions?: string[];
  [key: string]: any;
}

export function TextAnalyzer({ initialText = "" }: TextAnalyzerProps) {
  const { toast } = useToast();
  const [text, setText] = useState(initialText);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("general");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (data: { text: string; analysisType: string }) => {
      try {
        // Use the new AI API endpoint for text analysis
        const res = await apiRequest("POST", "/api/ai/analyze", {
          text: data.text,
          type: data.analysisType
        });
        
        // Handle authentication errors gracefully
        if (res.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to analyze text",
            variant: "destructive",
          });
          throw new Error("Authentication required");
        }
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to analyze text");
        }
        
        // Parse the JSON response safely
        try {
          return await res.json();
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError);
          throw new Error("Invalid response from server");
        }
      } catch (error: any) {
        console.error("Text analysis error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (!data) {
        toast({
          title: "Invalid response",
          description: "Received an empty response from the server",
          variant: "destructive",
        });
        return;
      }
      
      setResult(data);
      toast({
        title: "Analysis complete",
        description: "Text analysis has been completed successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Text analysis mutation error:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text || text.trim().length < 10) {
      toast({
        title: "Text too short",
        description: "Please enter at least 10 characters of text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    analyzeMutation.mutate({
      text,
      analysisType,
    });
  };

  const renderAnalysisResult = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Analysis Results</h3>
        
        {/* Sentiment Analysis */}
        {result.sentiment && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">Sentiment</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Negative</span>
              <Progress value={((result.sentiment.score + 1) / 2) * 100} className="h-2" />
              <span className="text-sm">Positive</span>
            </div>
            <p className="text-sm mt-1">{result.sentiment.assessment}</p>
            
            {result.sentiment.positiveAspects && result.sentiment.positiveAspects.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Positive aspects:</span>
                <ul className="list-disc list-inside text-sm ml-2">
                  {result.sentiment.positiveAspects.map((aspect, i) => (
                    <li key={i}>{aspect}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.sentiment.negativeAspects && result.sentiment.negativeAspects.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Areas for improvement:</span>
                <ul className="list-disc list-inside text-sm ml-2">
                  {result.sentiment.negativeAspects.map((aspect, i) => (
                    <li key={i}>{aspect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Topics */}
        {result.topics && result.topics.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">Main Topics</h4>
            <div className="flex flex-wrap gap-2">
              {result.topics.map((topic, i) => (
                <div key={i} className="px-2 py-1 bg-secondary/30 rounded-md text-sm">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Readability */}
        {result.readability && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">Readability</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Complex</span>
              <Progress value={result.readability.score * 10} className="h-2" />
              <span className="text-sm">Simple</span>
            </div>
            <p className="text-sm mt-1">Level: {result.readability.level}</p>
            
            {result.readability.suggestions && result.readability.suggestions.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Suggestions:</span>
                <ul className="list-disc list-inside text-sm ml-2">
                  {result.readability.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* SEO */}
        {result.seo && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">SEO Analysis</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Poor</span>
              <Progress value={result.seo.score * 10} className="h-2" />
              <span className="text-sm">Excellent</span>
            </div>
            
            {result.seo.keywords && result.seo.keywords.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Keywords detected:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {result.seo.keywords.map((keyword, i) => (
                    <div key={i} className="px-2 py-1 bg-primary/20 rounded-md text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {result.seo.suggestions && result.seo.suggestions.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">SEO Suggestions:</span>
                <ul className="list-disc list-inside text-sm ml-2">
                  {result.seo.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* General Analysis */}
        {result.summary && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">Summary</h4>
            <p className="text-sm">{result.summary}</p>
          </div>
        )}
        
        {result.tone && (
          <div className="mt-2">
            <span className="text-sm font-medium">Tone: </span>
            <span className="text-sm">{result.tone}</span>
          </div>
        )}
        
        {/* General Suggestions */}
        {result.suggestions && result.suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-md font-medium">Improvement Suggestions</h4>
            <ul className="list-disc list-inside text-sm ml-2">
              {result.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
          Text Analyzer
        </CardTitle>
        <CardDescription>
          Analyze text for sentiment, readability, SEO, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="analysisType" className="text-sm font-medium">
              Analysis Type
            </label>
            <Select value={analysisType} onValueChange={(value) => setAnalysisType(value as AnalysisType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Analysis</SelectItem>
                <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                <SelectItem value="readability">Readability Check</SelectItem>
                <SelectItem value="seo">SEO Analysis</SelectItem>
                <SelectItem value="topics">Topic Extraction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="text" className="text-sm font-medium">
              Text to Analyze
            </label>
            <Textarea
              id="text"
              placeholder="Enter text to analyze..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={analyzeMutation.isPending || !text || text.trim().length < 10}
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
        </form>
        
        {renderAnalysisResult()}
      </CardContent>
    </Card>
  );
}