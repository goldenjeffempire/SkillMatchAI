
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocsPage() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API endpoint copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
            <p className="text-muted-foreground">Access Echoverse APIs programmatically</p>
          </div>
          <Button>
            <Key className="w-4 h-4 mr-2" />
            Generate API Key
          </Button>
        </div>

        <Tabs defaultValue="authentication">
          <TabsList>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="jobs">Jobs API</TabsTrigger>
            <TabsTrigger value="calendar">Calendar API</TabsTrigger>
            <TabsTrigger value="ai">AI Services</TabsTrigger>
          </TabsList>

          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <pre className="text-sm">
                      POST /api/auth/token
                    </pre>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/auth/token")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate an API token by sending your credentials to this endpoint.
                  Include the token in subsequent requests in the Authorization header.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Jobs API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <pre className="text-sm">
                      GET /api/jobs
                    </pre>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/jobs")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-start">
                    <pre className="text-sm">
                      POST /api/calendar/events
                    </pre>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("/api/calendar/events")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
