import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Courses</h1>
          <Button asChild>
            <Link href="/courses/new">Create Course</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Course cards will be mapped here */}
          <Card>
            <CardHeader>
              <CardTitle>AI Fundamentals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Learn the basics of artificial intelligence and machine learning</p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/courses/ai-fundamentals">View Course</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}