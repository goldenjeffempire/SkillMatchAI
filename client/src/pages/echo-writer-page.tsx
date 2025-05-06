
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { FileText, Wand2 } from "lucide-react";
import { useState } from "react";

export default function EchoWriterPage() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          type: contentType,
          context: "writing" 
        })
      });
      const data = await res.json();
      // Handle generated content
    } catch (error) {
      console.error(error);
    }
    setGenerating(false);
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">EchoWriter</h1>
            <p className="text-muted-foreground">Generate engaging content with AI</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Select
                value={contentType}
                onValueChange={setContentType}
                options={[
                  { label: "Blog Post", value: "blog" },
                  { label: "Product Description", value: "product" },
                  { label: "Social Media", value: "social" },
                  { label: "Email", value: "email" },
                  { label: "SEO Content", value: "seo" }
                ]}
              />
            </div>

            <Textarea
              placeholder="Describe what you want to write..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />

            <Button onClick={handleGenerate} disabled={generating}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Content
            </Button>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Generated Content</h3>
              {/* Content preview area */}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
