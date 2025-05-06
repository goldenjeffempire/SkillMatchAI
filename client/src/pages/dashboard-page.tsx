import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsContent as TabsBody, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  BarChart2, 
  Users, 
  Activity, 
  Calendar, 
  Clock,
  BookMarked,
  Lightbulb,
  BookType,
  Zap,
  CheckCircle,
  Award,
  Star
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";

// Dashboard welcome greeting based on time of day
function WelcomeGreeting({ username }: { username: string }) {
  const [greeting, setGreeting] = useState("Hello");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);
  
  return (
    <h1 className="text-3xl font-bold tracking-tight">
      {greeting}, <span className="text-primary">{username}</span>
    </h1>
  );
}

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  valueLabel?: string;
}

function ProgressRing({ 
  value, 
  size = 80, 
  strokeWidth = 6, 
  className = "", 
  label,
  valueLabel
}: ProgressRingProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  return (
    <div className={`relative ${className}`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-muted-foreground/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {valueLabel ? (
          <span className="text-xl font-semibold">{valueLabel}</span>
        ) : (
          <span className="text-xl font-semibold">{normalizedValue}%</span>
        )}
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
}

// Activity Card Component
function ActivityCard({ title, icon, value, change, positive = true }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${positive ? 'text-green-500' : 'text-red-500'}`}>
          <span>{change}</span>
          <ArrowUpRight className="h-3 w-3 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Action Button
function QuickAction({ icon, label, href, color = "primary" }) {
  const [, navigate] = useLocation();
  
  const handleClick = () => {
    navigate(href);
  };
  
  const bgColorMap = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
    purple: "bg-purple-500/20 text-purple-500",
    blue: "bg-blue-500/20 text-blue-500",
    amber: "bg-amber-500/20 text-amber-500",
    emerald: "bg-emerald-500/20 text-emerald-500",
    rose: "bg-rose-500/20 text-rose-500",
  };
  
  return (
    <Button 
      variant="ghost" 
      className="h-auto flex-col items-center justify-center py-4 text-center w-full hover:bg-muted space-y-2"
      onClick={handleClick}
    >
      <div className={`w-10 h-10 rounded-full ${bgColorMap[color]} flex items-center justify-center mx-auto`}>
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Button>
  );
}

// Book recommendation card
interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  rating: number;
  category: string;
}

function BookCard({ title, author, cover, rating, category }: BookCardProps) {
  return (
    <div className="flex space-x-3">
      <div className="h-16 w-12 rounded overflow-hidden flex-shrink-0">
        <img src={cover} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{author}</p>
        <div className="flex items-center mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs ml-1">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

// Upcoming event card
function EventCard({ title, date, time, participants }) {
  return (
    <div className="flex items-center space-x-3 py-2">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
        <span className="text-xs">{date.split(" ")[0]}</span>
        <span className="text-lg font-bold">{date.split(" ")[1]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{title}</h4>
        <div className="flex items-center mt-1">
          <Clock className="h-3 w-3 text-muted-foreground mr-1" />
          <span className="text-xs text-muted-foreground">{time}</span>
          {participants && (
            <>
              <span className="mx-1 text-muted-foreground">•</span>
              <Users className="h-3 w-3 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{participants} participants</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/user/stats");
        return await response.json();
      } catch (error) {
        // Return default stats if endpoint not implemented yet
        return {
          contentCreated: 15,
          projectsCompleted: 3,
          learningProgress: 68,
          socialInteractions: 24,
          bookmarkCount: 12,
          subscriptionStatus: "active",
          subscriptionType: "Pro",
          aiCreditsUsed: 287,
          aiCreditsTotal: 500,
          recentActivity: [
            { type: "content_created", title: "Blog post on AI trends", timestamp: new Date().toISOString() },
            { type: "book_read", title: "The Future of AI", timestamp: new Date().toISOString() },
            { type: "project_created", title: "Marketing website", timestamp: new Date().toISOString() }
          ],
          weeklyGoalProgress: 65
        };
      }
    },
    // Don't refetch on window focus
    refetchOnWindowFocus: false,
    // Don't show errors
    retry: false
  });
  
  // Load placeholder data if real data isn't available yet
  const stats = userStats || {
    contentCreated: 0,
    projectsCompleted: 0,
    learningProgress: 0,
    socialInteractions: 0,
    bookmarkCount: 0,
    subscriptionStatus: "inactive",
    subscriptionType: "Free",
    aiCreditsUsed: 0,
    aiCreditsTotal: 100,
    recentActivity: [],
    weeklyGoalProgress: 0
  };
  
  // Get role-specific dashboard components
  const getRoleDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case "admin":
        return <AdminDashboard stats={stats} />;
      case "business":
        return <BusinessDashboard stats={stats} />;
      case "marketer":
        return <MarketerDashboard stats={stats} />;
      case "educator":
        return <EducatorDashboard stats={stats} />;
      case "student":
        return <StudentDashboard stats={stats} />;
      case "parent":
        return <ParentDashboard stats={stats} />;
      default:
        return <DefaultDashboard stats={stats} />;
    }
  };
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  return (
    <DashboardLayout>
      <div className="container py-6 max-w-7xl">
        {/* Welcome header */}
        <div className="mb-8">
          <WelcomeGreeting username={user.fullName || user.username} />
          <p className="text-muted-foreground">
            Here's what's happening with your Echoverse account today.
          </p>
        </div>
        
        {/* Dashboard content */}
        {getRoleDashboard()}
      </div>
    </DashboardLayout>
  );
}

// Default dashboard for users without specific roles
function DefaultDashboard({ stats }) {
  return (
    <>
      {/* Quick actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Things you can do right away</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            <QuickAction 
              icon={<Sparkles size={18} />} 
              label="Generate Content" 
              href="/ai-studio" 
              color="primary"
            />
            <QuickAction 
              icon={<BookOpen size={18} />} 
              label="Library" 
              href="/library" 
              color="purple"
            />
            <QuickAction 
              icon={<MessageSquare size={18} />} 
              label="Social Feed" 
              href="/social" 
              color="blue"
            />
            <QuickAction 
              icon={<BarChart2 size={18} />} 
              label="Analytics" 
              href="/analytics" 
              color="emerald"
            />
            <QuickAction 
              icon={<Users size={18} />} 
              label="Community" 
              href="/community" 
              color="amber"
            />
            <QuickAction 
              icon={<Activity size={18} />} 
              label="Your Activity" 
              href="/activity" 
              color="rose"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <ActivityCard 
          title="Content Created" 
          icon={<Sparkles className="h-4 w-4" />} 
          value={stats.contentCreated.toString()} 
          change="+24% from last month" 
          positive={true}
        />
        <ActivityCard 
          title="Projects Completed" 
          icon={<CheckCircle className="h-4 w-4" />} 
          value={stats.projectsCompleted.toString()} 
          change="+12% from last month" 
          positive={true}
        />
        <ActivityCard 
          title="Learning Progress" 
          icon={<BookType className="h-4 w-4" />} 
          value={`${stats.learningProgress}%`} 
          change="+5% from last week" 
          positive={true}
        />
        <ActivityCard 
          title="Social Interactions" 
          icon={<MessageSquare className="h-4 w-4" />} 
          value={stats.socialInteractions.toString()} 
          change="+18% from last month" 
          positive={true}
        />
      </div>
      
      {/* Main dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Credits & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Usage & Goals</CardTitle>
              <CardDescription>Your AI credit usage and weekly goals progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">AI Credits</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {stats.aiCreditsUsed} / {stats.aiCreditsTotal} credits used
                    </span>
                    <span className="text-sm font-medium">{Math.round((stats.aiCreditsUsed / stats.aiCreditsTotal) * 100)}%</span>
                  </div>
                  <Progress value={(stats.aiCreditsUsed / stats.aiCreditsTotal) * 100} className="h-2" />
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Zap className="h-3 w-3 mr-1" />
                      Upgrade for more credits
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h4 className="text-sm font-medium mb-2 self-start">Weekly Goals</h4>
                  <div className="flex-1 flex items-center justify-center">
                    <ProgressRing
                      value={stats.weeklyGoalProgress}
                      size={120}
                      strokeWidth={10}
                      label="Completed"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for different dashboard views */}
          <Tabs defaultValue="activity">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {activity.type === 'content_created' && <Sparkles className="h-5 w-5 text-primary" />}
                            {activity.type === 'book_read' && <BookOpen className="h-5 w-5 text-primary" />}
                            {activity.type === 'project_created' && <Zap className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No recent activity to show</p>
                        <Button variant="outline" className="mt-4">
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommended">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium mb-3">Based on your interests</h3>
                      <div className="space-y-4">
                        <BookCard 
                          title="AI-Powered Business Transformation"
                          author="Jennifer Rodriguez"
                          cover="https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                          rating={4.8}
                          category="Business"
                        />
                        <BookCard 
                          title="The Psychology of Productivity"
                          author="Michael Chang"
                          cover="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                          rating={4.5}
                          category="Self-Help"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">AI Tools to Try</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">AI Writer</h4>
                                <p className="text-xs text-muted-foreground">Create content</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Lightbulb className="h-5 w-5 text-blue-500" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">Idea Generator</h4>
                                <p className="text-xs text-muted-foreground">Brainstorm</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending in Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium mb-3">Popular Books</h3>
                      <div className="space-y-4">
                        <BookCard 
                          title="The Future of AI in Business"
                          author="David Chen"
                          cover="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                          rating={4.9}
                          category="Business"
                        />
                        <BookCard 
                          title="Digital Transformation Guide"
                          author="Sarah Johnson"
                          cover="https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
                          rating={4.7}
                          category="Technology"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Hot Topics</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">#AIRevolution</span>
                          <span className="text-xs text-muted-foreground">1.2k posts</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">#DigitalTransformation</span>
                          <span className="text-xs text-muted-foreground">843 posts</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">#FutureOfWork</span>
                          <span className="text-xs text-muted-foreground">721 posts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Subscription card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center p-3 bg-primary/10 rounded-lg mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">{stats.subscriptionType}</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.subscriptionStatus === "active" ? "Active subscription" : "Inactive"}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Full access to AI tools</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">{stats.aiCreditsTotal} AI credits per month</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Priority customer support</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming events */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <EventCard
                  title="AI Writing Workshop"
                  date="May 15"
                  time="2:00 PM - 3:30 PM"
                  participants={24}
                />
                <EventCard
                  title="Content Strategy Webinar"
                  date="May 20"
                  time="11:00 AM - 12:00 PM"
                  participants={56}
                />
                <EventCard
                  title="Community Meetup"
                  date="May 25"
                  time="6:00 PM - 8:00 PM"
                  participants={18}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Bookmarks */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Bookmarks</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats.bookmarkCount > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookMarked className="h-4 w-4 text-blue-500" />
                    <span className="text-sm truncate">Marketing Strategy Template</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookMarked className="h-4 w-4 text-blue-500" />
                    <span className="text-sm truncate">AI Content Creation Guide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookMarked className="h-4 w-4 text-blue-500" />
                    <span className="text-sm truncate">Digital Productivity Cheatsheet</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <BookMarked className="h-4 w-4 mr-1" />
                    Browse Library
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Admin Dashboard
function AdminDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}

// Business Dashboard
function BusinessDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}

// Marketer Dashboard
function MarketerDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}

// Educator Dashboard
function EducatorDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}

// Student Dashboard
function StudentDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}

// Parent Dashboard
function ParentDashboard({ stats }) {
  return (
    <DefaultDashboard stats={stats} />
  );
}