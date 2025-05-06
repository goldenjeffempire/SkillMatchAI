
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Code2, Bug, Blocks } from "lucide-react";
import { useState } from "react";

export default function EchoDevPage() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [type, setType] = useState("code");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/dev/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language, type })
      });
      const data = await res.json();
      setResult(data.result);
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
            <h1 className="text-3xl font-bold">EchoDevBot</h1>
            <p className="text-muted-foreground">Code generation and development tools</p>
          </div>
        </div>

        <Tabs defaultValue="code" className="space-y-4">
          <TabsList>
            <TabsTrigger value="code">
              <Code2 className="w-4 h-4 mr-2" />
              Code Generation
            </TabsTrigger>
            <TabsTrigger value="debug">
              <Bug className="w-4 h-4 mr-2" />
              Debug Helper
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Blocks className="w-4 h-4 mr-2" />
              Architecture Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="code">
            <Card className="p-6">
              <div className="space-y-4">
                <Select
                  value={language}
                  onValueChange={setLanguage}
                  options={[
                    { label: "JavaScript", value: "javascript" },
                    { label: "Python", value: "python" },
                    { label: "TypeScript", value: "typescript" },
                    { label: "Java", value: "java" },
                    { label: "C++", value: "cpp" }
                  ]}
                />

                <Textarea
                  placeholder="Describe what you want to build..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <Code2 className="mr-2 h-4 w-4" />
                  Generate Code
                </Button>

                {result && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Generated Code</h3>
                    <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
                      <code>{result}</code>
                    </pre>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="debug">
            <Card className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your code here and describe the issue..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={8}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <Bug className="mr-2 h-4 w-4" />
                  Debug Code
                </Button>

                {result && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Debug Analysis</h3>
                    <div className="bg-secondary p-4 rounded-lg whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="architecture">
            <Card className="p-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your system requirements..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <Blocks className="mr-2 h-4 w-4" />
                  Generate Architecture
                </Button>

                {result && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Architecture Design</h3>
                    <div className="bg-secondary p-4 rounded-lg whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
