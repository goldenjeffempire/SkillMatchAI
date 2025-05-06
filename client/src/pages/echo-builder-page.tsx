
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Layout, Wand2 } from "lucide-react";
import { useState } from "react";

export default function EchoBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const res = await fetch('/api/templates');
      return res.json();
    }
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      // Handle generated website data
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
            <h1 className="text-3xl font-bold">EchoBuilder</h1>
            <p className="text-muted-foreground">Generate websites and stores with AI</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Describe your website or store..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Button onClick={handleGenerate} disabled={generating}>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates?.map((template: any) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    <h3 className="font-medium">{template.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
