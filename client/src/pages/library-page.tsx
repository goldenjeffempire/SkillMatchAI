import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import {
  Search,
  BookOpen,
  Bookmark,
  TrendingUp,
  Star,
  Clock,
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  Heart,
  Clock8,
  Lightbulb,
  Award,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  cover: string;
  category: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  pagesCount: number;
  readTime: number;
  publishedDate: string;
  readCount: number;
  aiSummaryAvailable: boolean;
  userProgress?: number;
  isBookmarked?: boolean;
}

// Book card component
function BookCard({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card-hover"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
          />
          {book.aiSummaryAvailable && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-primary text-white">
                <Lightbulb className="w-3 h-3 mr-1" />
                AI Summary
              </Badge>
            </div>
          )}
          {book.userProgress && book.userProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={book.userProgress} className="h-1 rounded-none" />
            </div>
          )}
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-base line-clamp-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground">{book.author}</p>
            </div>
            <div className="flex items-center text-yellow-500">
              <Star className="fill-yellow-500 w-4 h-4" />
              <span className="text-xs ml-1">{book.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <BookOpen className="w-3 h-3 mr-1" />
            <span>{book.pagesCount} pages</span>
            <span className="mx-2">•</span>
            <Clock className="w-3 h-3 mr-1" />
            <span>{book.readTime} min read</span>
          </div>
          
          <div className="mt-3 space-x-1">
            {book.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {book.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{book.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <DialogTrigger asChild>
            <Button className="flex-1">Read Now</Button>
          </DialogTrigger>
          <Button variant="outline" size="icon">
            <Bookmark className={`w-4 h-4 ${book.isBookmarked ? "fill-primary text-primary" : ""}`} />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Book details dialog component
function BookDialog({ book }: { book: Book }) {
  const [tab, setTab] = useState("overview");
  const { user } = useAuth();
  const { toast } = useToast();
  
  return (
    <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0">
      <DialogHeader className="px-6 pt-6 pb-2">
        <DialogTitle className="text-2xl">{book.title}</DialogTitle>
        <DialogDescription>{book.author}</DialogDescription>
      </DialogHeader>
      
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
            <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <TabsContent value="overview" className="mt-0 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                {book.aiSummaryAvailable && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-primary text-white">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      AI Summary
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{book.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="font-medium">Rating</span>
                      </div>
                      <div className="text-lg font-semibold">{book.rating.toFixed(1)}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Based on {book.ratingCount} ratings</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock8 className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="font-medium">Reading Time</span>
                      </div>
                      <div className="text-lg font-semibold">{book.readTime} min</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{book.pagesCount} pages total</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium">Read Count</span>
                      </div>
                      <div className="text-lg font-semibold">{book.readCount}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Times read by users</p>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="w-5 h-5 text-purple-500 mr-2" />
                        <span className="font-medium">Category</span>
                      </div>
                      <div className="text-sm font-semibold">{book.category}</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{book.tags.join(", ")}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Key Takeaways</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                      <span>Learn practical strategies for professional growth</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                      <span>Understand how to leverage AI tools effectively</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                      <span>Develop a mindset focused on continuous improvement</span>
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Button className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Reading
                  </Button>
                  <Button variant="outline">
                    <Bookmark className={`w-4 h-4 mr-2 ${book.isBookmarked ? "fill-primary text-primary" : ""}`} />
                    {book.isBookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="read" className="mt-0 h-full">
            <div className="prose prose-lg dark:prose-invert mx-auto h-full overflow-y-auto p-6 border rounded-lg">
              <h1>{book.title}</h1>
              <h3>By {book.author}</h3>
              
              <h2>Chapter 1: Introduction</h2>
              <p>
                The landscape of modern business has undergone a radical transformation in recent years. 
                With the advent of artificial intelligence, machine learning, and automation technologies, 
                organizations across industries find themselves at a crossroads: embrace the digital 
                revolution or risk obsolescence.
              </p>
              
              <p>
                This book provides a comprehensive framework for business leaders, entrepreneurs, and 
                professionals looking to harness the power of emerging technologies. You'll discover 
                practical strategies for implementing AI solutions, optimizing workflows, and fostering 
                a culture of innovation within your organization.
              </p>
              
              <p>
                Throughout these pages, we'll explore real-world case studies of companies that have 
                successfully navigated digital transformation, as well as cautionary tales of those 
                that failed to adapt. By the end, you'll have a clear roadmap for leveraging technology 
                to drive growth, enhance customer experiences, and maintain a competitive edge in today's 
                rapidly evolving marketplace.
              </p>
              
              <h2>Chapter 2: Understanding the AI Landscape</h2>
              <p>
                Before diving into implementation strategies, it's essential to develop a foundational 
                understanding of the current technological landscape. This chapter breaks down complex 
                AI concepts into accessible frameworks, helping you distinguish between different types 
                of artificial intelligence and their business applications.
              </p>
              
              <p>
                We'll explore the differences between narrow AI (designed for specific tasks) and 
                general AI (capable of learning across domains), as well as the practical implications 
                of machine learning, natural language processing, computer vision, and predictive analytics 
                for business operations.
              </p>
              
              <p>
                By establishing this foundation, you'll be better equipped to identify opportunities 
                for technological integration within your specific industry context, avoiding common 
                pitfalls and misaligned investments that plague many digital transformation initiatives.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-summary" className="mt-0 h-full">
            {book.aiSummaryAvailable ? (
              <div className="space-y-6">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center">
                    <Lightbulb className="w-5 h-5 text-primary mr-2" />
                    <h3 className="font-medium">AI-Generated Summary</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">This summary was created using advanced AI to capture the key points and insights from the book.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Core Concept</h3>
                    <p>
                      This book explores how businesses can successfully navigate digital transformation by
                      implementing AI technologies and fostering a culture of innovation. It provides practical
                      frameworks for leveraging emerging technologies to drive growth and maintain competitiveness.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Key Points</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span>Digital transformation is essential for organizational survival in the modern business landscape</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span>Understanding different types of AI technologies is crucial for identifying appropriate business applications</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span>Successful implementation requires both technological expertise and cultural adaptation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-1" />
                        <span>Case studies demonstrate patterns of success and failure in digital transformation initiatives</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Practical Applications</h3>
                    <p>
                      Readers can apply the book's frameworks to assess their organization's digital readiness,
                      identify high-impact areas for AI implementation, develop strategic roadmaps for technology
                      adoption, and create training programs to build necessary capabilities within their teams.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Who Should Read This</h3>
                    <p>
                      This book is ideal for business leaders, executives, entrepreneurs, and professionals
                      looking to understand how to effectively leverage AI and digital technologies in their
                      organizations. It's particularly valuable for those leading transformation initiatives
                      or responsible for innovation strategies.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="p-8 text-center max-w-md">
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Summary Not Available</h3>
                  <p className="text-muted-foreground mb-6">
                    This book doesn't have an AI-generated summary yet. We're constantly adding new summaries to our library.
                  </p>
                  <Button variant="outline">Request Summary</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
      
      <DialogFooter className="px-6 py-4 border-t">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Heart className={`w-4 h-4`} />
            </Button>
            <Button variant="outline" size="icon">
              <Bookmark className={`w-4 h-4 ${book.isBookmarked ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
          
          <Button className="px-8">Start Reading</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}

// Skeleton loaders for books
function BookCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    hasAiSummary: false,
    readingTime: null as null | "short" | "medium" | "long",
    rating: 0,
  });
  
  // Categories for the library
  const categories = [
    { id: "all", name: "All Books", count: 432, icon: <BookOpen className="h-4 w-4" /> },
    { id: "business", name: "Business Growth", count: 94, icon: <TrendingUp className="h-4 w-4" /> },
    { id: "personal", name: "Personal Development", count: 128, icon: <Lightbulb className="h-4 w-4" /> },
    { id: "leadership", name: "Leadership", count: 76, icon: <Award className="h-4 w-4" /> },
    { id: "education", name: "Learning & Education", count: 103, icon: <GraduationCap className="h-4 w-4" /> },
    { id: "health", name: "Health & Wellness", count: 67, icon: <Heart className="h-4 w-4" /> },
  ];
  
  // Fetch books
  const { data: books, isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books", activeCategory, searchQuery, filters],
    queryFn: async () => {
      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        
        if (activeCategory !== "all") {
          queryParams.append("category", activeCategory);
        }
        
        if (searchQuery) {
          queryParams.append("query", searchQuery);
        }
        
        if (filters.tags.length > 0) {
          filters.tags.forEach(tag => queryParams.append("tag", tag));
        }
        
        if (filters.hasAiSummary) {
          queryParams.append("aiSummary", "true");
        }
        
        if (filters.readingTime) {
          queryParams.append("readingTime", filters.readingTime);
        }
        
        if (filters.rating > 0) {
          queryParams.append("minRating", filters.rating.toString());
        }
        
        const url = `/api/books?${queryParams.toString()}`;
        const response = await apiRequest("GET", url);
        
        return response.json();
      } catch (error) {
        console.error("Error fetching books:", error);
        
        // For development, return placeholder books data
        return [
          {
            id: 1,
            title: "The AI-Powered Business",
            author: "Dr. Emily Johnson",
            description: "A comprehensive guide to implementing artificial intelligence in various business contexts. This book provides actionable insights for leaders looking to leverage AI for growth, efficiency, and innovation.",
            cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
            category: "business",
            tags: ["AI", "Business Strategy", "Digital Transformation"],
            rating: 4.7,
            ratingCount: 342,
            pagesCount: 286,
            readTime: 240,
            publishedDate: "2023-05-15",
            readCount: 5621,
            aiSummaryAvailable: true,
            userProgress: 65,
            isBookmarked: true
          },
          {
            id: 2,
            title: "Deep Focus: Mastering Productivity",
            author: "Michael Chang",
            description: "Learn how to achieve deep focus in a distracted world. This book combines neuroscience, practical techniques, and technology insights to help you maximize your productivity and creative output.",
            cover: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1200",
            category: "personal",
            tags: ["Productivity", "Focus", "Time Management"],
            rating: 4.5,
            ratingCount: 528,
            pagesCount: 218,
            readTime: 180,
            publishedDate: "2023-02-10",
            readCount: 7832,
            aiSummaryAvailable: true
          },
          {
            id: 3,
            title: "The Leadership Compass",
            author: "Sarah Wilson",
            description: "A guide to authentic leadership in the digital age. Discover how to lead with purpose, build high-performing teams, and navigate complex challenges in rapidly changing environments.",
            cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            category: "leadership",
            tags: ["Leadership", "Management", "Team Building"],
            rating: 4.8,
            ratingCount: 421,
            pagesCount: 324,
            readTime: 270,
            publishedDate: "2023-03-22",
            readCount: 4928,
            aiSummaryAvailable: true
          },
          {
            id: 4,
            title: "Digital Marketing Excellence",
            author: "James Rodriguez",
            description: "The definitive guide to digital marketing strategies that drive results. Learn how to create compelling campaigns, utilize data analytics, and optimize your marketing efforts for maximum ROI.",
            cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            category: "business",
            tags: ["Marketing", "Digital", "Strategy"],
            rating: 4.6,
            ratingCount: 389,
            pagesCount: 246,
            readTime: 210,
            publishedDate: "2023-01-15",
            readCount: 6241,
            aiSummaryAvailable: false
          },
          {
            id: 5,
            title: "Mindful Learning: Education Redefined",
            author: "Dr. Robert Chen",
            description: "A revolutionary approach to education that integrates mindfulness, neuroscience, and technology. This book provides educators and learners with strategies to enhance cognitive abilities and learning outcomes.",
            cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
            category: "education",
            tags: ["Education", "Learning", "Mindfulness"],
            rating: 4.9,
            ratingCount: 512,
            pagesCount: 298,
            readTime: 240,
            publishedDate: "2023-04-05",
            readCount: 5127,
            aiSummaryAvailable: true
          },
          {
            id: 6,
            title: "Holistic Health: Mind and Body Wellness",
            author: "Dr. Lisa Johnson",
            description: "A comprehensive guide to achieving optimal health through an integrated approach to physical, mental, and emotional well-being. Learn evidence-based strategies for long-term wellness.",
            cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGJvb2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            category: "health",
            tags: ["Health", "Wellness", "Mindfulness"],
            rating: 4.7,
            ratingCount: 378,
            pagesCount: 268,
            readTime: 220,
            publishedDate: "2023-03-10",
            readCount: 4829,
            aiSummaryAvailable: false,
            userProgress: 25
          }
        ];
      }
    },
    refetchOnWindowFocus: false
  });
  
  // Filter books based on active category and search query
  const filteredBooks = books?.filter(book => {
    // Filter by category
    if (activeCategory !== "all" && book.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  }) || [];
  
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect with dependencies on searchQuery
  };
  
  const handleClearSearch = () => {
    setSearchQuery("");
  };
  
  const handleTagFilter = (tag: string) => {
    setFilters(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: newTags };
    });
  };
  
  const handleAiSummaryFilter = () => {
    setFilters(prev => ({ ...prev, hasAiSummary: !prev.hasAiSummary }));
  };
  
  const handleReadingTimeFilter = (time: "short" | "medium" | "long" | null) => {
    setFilters(prev => ({ ...prev, readingTime: time }));
  };
  
  const handleRatingFilter = (rating: number) => {
    setFilters(prev => ({ ...prev, rating }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      tags: [],
      hasAiSummary: false,
      readingTime: null,
      rating: 0,
    });
  };
  
  // Get all tags from books for filter dropdown
  const allTags = Array.from(
    new Set(books?.flatMap(book => book.tags) || [])
  ).sort();
  
  // Check if any filters are active
  const isFiltering = 
    filters.tags.length > 0 || 
    filters.hasAiSummary || 
    filters.readingTime !== null || 
    filters.rating > 0;
  
  return (
    <MainLayout>
      <div className="container py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Books Library</h1>
            <p className="text-muted-foreground mt-1">
              Discover books for growth, success, and learning
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search books, authors, or topics..."
                className="pl-10 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Left sidebar */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "ghost"}
                    className="justify-start w-full font-normal"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.icon}
                    <span className="ml-2">{category.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">({category.count})</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-center">
                  <span>Filters</span>
                  {isFiltering && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 text-xs">
                      Clear All
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-3">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Tags</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <span>Select Tags</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-[300px] overflow-y-auto">
                        {allTags.map((tag) => (
                          <DropdownMenuCheckboxItem
                            key={tag}
                            checked={filters.tags.includes(tag)}
                            onCheckedChange={() => handleTagFilter(tag)}
                          >
                            {tag}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {filters.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {filters.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => handleTagFilter(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Reading Time</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={filters.readingTime === "short" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReadingTimeFilter(filters.readingTime === "short" ? null : "short")}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Short
                    </Button>
                    <Button
                      variant={filters.readingTime === "medium" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReadingTimeFilter(filters.readingTime === "medium" ? null : "medium")}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Medium
                    </Button>
                    <Button
                      variant={filters.readingTime === "long" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleReadingTimeFilter(filters.readingTime === "long" ? null : "long")}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Long
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Rating</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {filters.rating > 0 ? `${filters.rating}+ Stars` : "Any Rating"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleRatingFilter(0)}>
                        Any Rating
                      </DropdownMenuItem>
                      {[3, 3.5, 4, 4.5].map((rating) => (
                        <DropdownMenuItem key={rating} onClick={() => handleRatingFilter(rating)}>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="ml-2">{rating}+</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="ai-summary"
                      checked={filters.hasAiSummary}
                      onChange={handleAiSummaryFilter}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="ai-summary" className="text-sm font-medium cursor-pointer">
                      AI Summary Available
                    </label>
                  </div>
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Reading Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Books Read</span>
                    <span className="font-medium">12</span>
                  </div>
                  <Progress value={12} max={50} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Reading Streak</span>
                    <span className="font-medium">7 days</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[true, true, true, true, true, true, true].map((active, i) => (
                      <div
                        key={i}
                        className={`h-6 rounded-sm ${active ? "bg-primary" : "bg-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Weekly Goal</span>
                    <span className="text-xs text-muted-foreground">3 of 5 books</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            {/* Featured books section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.slice(0, 3).map((book) => (
                    <Dialog key={book.id} onOpenChange={() => setSelectedBook(book)}>
                      <DialogTrigger asChild>
                        <div>
                          <BookCard book={book} />
                        </div>
                      </DialogTrigger>
                      <BookDialog book={book} />
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
            
            {/* All books section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">All Books</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                      <Filter className="h-4 w-4" />
                      <span>Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Highest Rated</DropdownMenuItem>
                    <DropdownMenuItem>Most Popular</DropdownMenuItem>
                    <DropdownMenuItem>Reading Time (Short to Long)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredBooks.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No books found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any books matching your criteria.
                  </p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <Dialog key={book.id} onOpenChange={() => setSelectedBook(book)}>
                      <DialogTrigger asChild>
                        <div>
                          <BookCard book={book} />
                        </div>
                      </DialogTrigger>
                      <BookDialog book={book} />
                    </Dialog>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}