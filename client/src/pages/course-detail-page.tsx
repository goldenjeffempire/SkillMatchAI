import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "wouter";

export default function CourseDetailPage() {
  const params = useParams();

  return (
    <DashboardLayout>
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Course ID: {params.id}</p>
            {/* Course content will be loaded here */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}