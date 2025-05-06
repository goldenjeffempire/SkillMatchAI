
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Mail, Users, Target, BarChart } from "lucide-react";
import { useState } from "react";

export default function EchoMarketerPage() {
  const [emailPrompt, setEmailPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: emailPrompt,
          type: 'email',
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
            <h1 className="text-3xl font-bold">EchoMarketer</h1>
            <p className="text-muted-foreground">Email funnels, CRM and lead generation</p>
          </div>
        </div>

        <Tabs defaultValue="email" className="space-y-4">
          <TabsList>
            <TabsTrigger value="email">
              <Mail className="w-4 h-4 mr-2" />
              Email Funnels
            </TabsTrigger>
            <TabsTrigger value="crm">
              <Users className="w-4 h-4 mr-2" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Target className="w-4 h-4 mr-2" />
              Lead Gen
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Select
                    options={[
                      { label: "Welcome Email", value: "welcome" },
                      { label: "Follow-up", value: "followup" },
                      { label: "Newsletter", value: "newsletter" },
                      { label: "Sales Email", value: "sales" },
                      { label: "Drip Campaign", value: "drip" }
                    ]}
                  />
                </div>

                <Textarea
                  placeholder="Describe your email campaign..."
                  value={emailPrompt}
                  onChange={(e) => setEmailPrompt(e.target.value)}
                  rows={4}
                />

                <Button onClick={handleGenerate} disabled={generating}>
                  <Mail className="mr-2 h-4 w-4" />
                  Generate Email Campaign
                </Button>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Campaign Preview</h3>
                  {/* Email preview area */}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="crm">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Management</h3>
                {/* CRM functionality */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Lead Generation</h3>
                {/* Lead generation tools */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Marketing Analytics</h3>
                {/* Analytics dashboard */}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
