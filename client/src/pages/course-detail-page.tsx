
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { Play, Book, Trophy, Users, CheckCircle2 } from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="aspect-video rounded-lg bg-muted mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced AI Development</h1>
            <p className="text-muted-foreground mb-6">
              Learn to build and deploy advanced AI systems with practical examples and hands-on projects.
            </p>

            <Tabs defaultValue="content" className="space-y-6">
              <TabsList>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                {[1, 2, 3].map((module) => (
                  <div key={module} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Module {module}: Introduction to AI Systems</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((lesson) => (
                        <div key={lesson} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                          <div className="flex items-center gap-3">
                            <Play className="w-4 h-4" />
                            <span>Lesson {lesson}: AI Fundamentals</span>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <div className="space-y-4">
                <Button className="w-full">Continue Learning</Button>
                <Progress value={45} />
                <p className="text-sm text-center text-muted-foreground">45% Complete</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 border rounded-lg">
                  <Book className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">12 Lessons</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Trophy className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">4 Projects</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">256 Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
