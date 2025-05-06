import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { BookOpen, GraduationCap, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EchoTeacherPage() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("lesson");
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!prompt) {
      toast({
        title: "Input Required",
        description: "Please enter a prompt to generate educational content",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate-educational", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type, subject })
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate educational content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">EchoTeacher</h1>
            <p className="text-muted-foreground">AI-powered educational content generation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Educational Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Content Type</label>
                <Select
                  value={type}
                  onValueChange={setType}
                  options={[
                    { label: "Lesson Plan", value: "lesson" },
                    { label: "Quiz", value: "quiz" },
                    { label: "Interactive Activity", value: "interactive" },
                    { label: "Curriculum", value: "curriculum" }
                  ]}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Subject Area</label>
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  options={[
                    { label: "Mathematics", value: "math" },
                    { label: "Science", value: "science" },
                    { label: "Language Arts", value: "language" },
                    { label: "Social Studies", value: "social" },
                    { label: "Computer Science", value: "cs" }
                  ]}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Description</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the educational content you want to create..."
                  rows={5}
                />
              </div>

              <Button onClick={generateContent} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[300px] rounded-md bg-muted p-4">
                <pre className="whitespace-pre-wrap break-words">
                  <code>{result || "Generated educational content will appear here..."}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}