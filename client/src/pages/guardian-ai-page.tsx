
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Shield, Book, Filter, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function GuardianAIPage() {
  const [settings, setSettings] = useState({
    contentFiltering: true,
    ageRestriction: "kids",
    safeSearch: true,
    timeLimit: 60,
  });

  const handleSave = async () => {
    try {
      const res = await fetch('/api/guardian/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      // Handle response
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">GuardianAI</h1>
            <p className="text-muted-foreground">Smart content filtering and parental controls</p>
          </div>
        </div>

        <Tabs defaultValue="filters" className="space-y-4">
          <TabsList>
            <TabsTrigger value="filters">
              <Filter className="w-4 h-4 mr-2" />
              Content Filters
            </TabsTrigger>
            <TabsTrigger value="safety">
              <Shield className="w-4 h-4 mr-2" />
              Safety Settings
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Activity Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filters">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Content Filtering</label>
                  <Switch 
                    checked={settings.contentFiltering}
                    onCheckedChange={(checked) => 
                      setSettings(s => ({...s, contentFiltering: checked}))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Age Restriction</label>
                  <Select
                    value={settings.ageRestriction}
                    onValueChange={(value) => 
                      setSettings(s => ({...s, ageRestriction: value}))
                    }
                    options={[
                      { label: "Kids (5-12)", value: "kids" },
                      { label: "Teens (13-17)", value: "teens" },
                      { label: "Young Adult", value: "young-adult" }
                    ]}
                  />
                </div>

                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Safe Search</label>
                  <Switch 
                    checked={settings.safeSearch}
                    onCheckedChange={(checked) => 
                      setSettings(s => ({...s, safeSearch: checked}))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Daily Time Limit (minutes)</label>
                  <Input 
                    type="number"
                    value={settings.timeLimit}
                    onChange={(e) => 
                      setSettings(s => ({...s, timeLimit: parseInt(e.target.value)}))
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
