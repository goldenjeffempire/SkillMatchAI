
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, BookOpen, BrainCircuit, ClipboardCheck } from "lucide-react";
import { useState } from "react";

export default function EchoTeacherPage() {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState("lesson");
  const [subject, setSubject] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-educational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          type: contentType,
          subject,
        })
      });
      const data = await res.json();
      // Handle response
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
            <h1 className="text-3xl font-bold">EchoTeacher</h1>
            <p className="text-muted-foreground">Create engaging lessons and quizzes with AI</p>
          </div>
        </div>

        <Tabs defaultValue="lesson" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lesson">
              <BookOpen className="w-4 h-4 mr-2" />
              Lesson Plans
            </TabsTrigger>
            <TabsTrigger value="quiz">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Quiz Generator
            </TabsTrigger>
            <TabsTrigger value="interactive">
              <BrainCircuit className="w-4 h-4 mr-2" />
              Interactive Content
            </TabsTrigger>
            <TabsTrigger value="curriculum">
              <GraduationCap className="w-4 h-4 mr-2" />
              Curriculum Design
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lesson">
            <Card className="p-6">
              <div className="space-y-4">
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  options={[
                    { label: "Mathematics", value: "math" },
                    { label: "Science", value: "science" },
                    { label: "Language Arts", value: "language" },
                    { label: "History", value: "history" },
                    { label: "Computer Science", value: "cs" }
                  ]}
                />

                <Textarea
                  placeholder="Describe the lesson you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Generate Lesson Plan 
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card className="p-6">
              <div className="space-y-4">
                <Select
                  value={subject}
                  onValueChange={setSubject}
                  options={[
                    { label: "Multiple Choice", value: "mc" },
                    { label: "True/False", value: "tf" },
                    { label: "Short Answer", value: "sa" },
                    { label: "Essay", value: "essay" }
                  ]}
                />

                <Textarea
                  placeholder="What topic would you like to create a quiz for?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Generate Quiz
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="interactive">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interactive Learning Materials</h3>
                {/* Interactive content tools */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Curriculum Design</h3>
                {/* Curriculum planning tools */}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
