
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Layout, Wand2, Code, Eye, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EchoBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [siteType, setSiteType] = useState("business");
  const [generating, setGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { toast } = useToast();

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const res = await fetch('/api/templates');
      return res.json();
    }
  });

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Input Required",
        description: "Please describe your website",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          type: siteType 
        })
      });
      
      if (!res.ok) throw new Error('Failed to generate website');
      
      const data = await res.json();
      setGeneratedCode(data.code);
      setPreviewUrl(data.previewUrl);
      
      toast({
        title: "Success!",
        description: "Your website has been generated",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate website",
        variant: "destructive"
      });
    }
    setGenerating(false);
  };

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">EchoBuilder</h1>
            <p className="text-muted-foreground">Generate websites and stores with AI</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                value={siteType}
                onValueChange={setSiteType}
                options={[
                  { label: "Business Website", value: "business" },
                  { label: "E-commerce Store", value: "store" },
                  { label: "Portfolio", value: "portfolio" },
                  { label: "Landing Page", value: "landing" },
                  { label: "Blog", value: "blog" }
                ]}
              />
              
              <Button 
                onClick={handleGenerate} 
                disabled={generating}
                className="w-full md:w-auto"
              >
                {generating ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Website
                  </>
                )}
              </Button>
            </div>

            <Textarea
              placeholder="Describe your website (e.g., 'A modern restaurant website with online ordering, menu display, and reservations')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </Card>

        {generatedCode && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Generated Code</h3>
                <Button onClick={downloadCode} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px]">
                <code>{generatedCode}</code>
              </pre>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Preview</h3>
                {previewUrl && (
                  <Button 
                    onClick={() => window.open(previewUrl, '_blank')}
                    variant="outline" 
                    size="sm"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Open Preview
                  </Button>
                )}
              </div>
              {previewUrl ? (
                <iframe 
                  src={previewUrl} 
                  className="w-full h-[500px] border rounded-lg"
                  title="Website Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
                  <p className="text-muted-foreground">Generate a website to see preview</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
