
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Trophy, Clock, Plus } from "lucide-react";
import { useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  enrolled: number;
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Portal</h1>
            <p className="text-muted-foreground">Expand your knowledge with our courses</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((course) => (
                <Card key={course} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative bg-muted rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{course % 3 === 0 ? 'Advanced' : course % 2 === 0 ? 'Intermediate' : 'Beginner'}</Badge>
                    <h3 className="font-medium mb-2">Course Title {course}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn essential skills and concepts with our comprehensive curriculum.
                    </p>
                    <Progress value={45} className="mb-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Progress: 45%</span>
                      <span>12 hours left</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
