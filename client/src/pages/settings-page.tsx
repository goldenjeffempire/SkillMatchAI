
import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Settings, Bell, Shield, User, Mail } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [security, setSecurity] = useState(true);

  return (
    <MainLayout>
      <div className="container py-6 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Input placeholder="Display Name" defaultValue="John Doe" />
                <Input placeholder="Email" defaultValue="john@example.com" type="email" />
                <Input placeholder="Bio" defaultValue="AI enthusiast and developer" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing Emails</span>
                <Switch checked={marketing} onCheckedChange={setMarketing} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Two-factor Authentication</span>
                <Switch checked={security} onCheckedChange={setSecurity} />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
