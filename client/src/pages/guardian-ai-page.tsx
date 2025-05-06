
import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Filter, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function GuardianAIPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    contentFiltering: true,
    ageRestriction: true,
    safeSearch: true,
    timeLimit: 120 // minutes
  });

  const { data: savedSettings, isLoading } = useQuery({
    queryKey: ['guardian-settings'],
    queryFn: async () => {
      const res = await fetch('/api/guardian/settings');
      return res.json();
    }
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const res = await fetch('/api/guardian/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardian-settings'] });
      toast({
        title: "Settings Updated",
        description: "Guardian AI settings have been saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    updateSettings.mutate(settings);
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Guardian AI</h1>
            <p className="text-muted-foreground">Manage content filtering and safety settings</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Safety Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="font-medium">Content Filtering</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filter inappropriate content and maintain a safe environment
                  </p>
                </div>
                <Switch
                  checked={settings.contentFiltering}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, contentFiltering: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="font-medium">Age Restriction</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable age-appropriate content restrictions
                  </p>
                </div>
                <Switch
                  checked={settings.ageRestriction}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, ageRestriction: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    <span className="font-medium">Safe Search</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Filter search results to exclude inappropriate content
                  </p>
                </div>
                <Switch
                  checked={settings.safeSearch}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, safeSearch: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Daily Time Limit (minutes)</span>
                </div>
                <Input
                  type="number"
                  value={settings.timeLimit}
                  onChange={(e) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      timeLimit: parseInt(e.target.value) || 0 
                    }))
                  }
                  min="0"
                  max="1440"
                />
                <p className="text-sm text-muted-foreground">
                  Set daily usage time limits (0 for unlimited)
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={updateSettings.isPending}
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
