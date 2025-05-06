
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
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifs">Email Notifications</Label>
                <Switch id="email-notifs" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifs">Push Notifications</Label>
                <Switch id="push-notifs" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">API Access</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex space-x-2 mt-2">
                  <Input id="api-key" type="password" value="************************" readOnly />
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select 
                  id="timezone" 
                  className="w-full mt-2 rounded-md border border-input bg-transparent px-3 py-2"
                >
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <select 
                  id="language" 
                  className="w-full mt-2 rounded-md border border-input bg-transparent px-3 py-2"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-red-600">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <div className="space-y-4">
              <Button variant="destructive">Delete Account</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
