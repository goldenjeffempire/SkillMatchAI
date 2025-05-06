import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Heart, HeartOff, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, Image, Link2, Smile, Globe, 
  Lock, Users, Clock, TrendingUp, Sparkles, Award, 
  BarChart2, UserPlus, ArrowUpRight
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interface for post data
interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

interface Like {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

interface Post {
  id: number;
  userId: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  content: string;
  mediaUrl?: string;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  role: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'just now';
  }
}

// Create post component
function CreatePostCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [visibility, setVisibility] = useState("public");
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; mediaUrl?: string; visibility: string }) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      // Reset form
      setContent("");
      setMediaUrl("");
      // Invalidate posts query to refresh the feed
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate({
      content,
      mediaUrl: mediaUrl || undefined,
      visibility,
    });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatarUrl || ""} />
            <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            
            {mediaUrl && (
              <div className="relative bg-muted rounded-md p-2">
                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate flex-1">{mediaUrl}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => setMediaUrl("")}
                  >
                    <HeartOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('media-url-input')?.focus()}>
                  <Image className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Media</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {visibility === "public" && <Globe className="h-4 w-4 mr-1" />}
                      {visibility === "friends" && <Users className="h-4 w-4 mr-1" />}
                      {visibility === "private" && <Lock className="h-4 w-4 mr-1" />}
                      <span className="hidden sm:inline">
                        {visibility === "public" && "Public"}
                        {visibility === "friends" && "Friends"}
                        {visibility === "private" && "Private"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setVisibility("public")}>
                      <Globe className="h-4 w-4 mr-2" />
                      <span>Public</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVisibility("friends")}>
                      <Users className="h-4 w-4 mr-2" />
                      <span>Friends only</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVisibility("private")}>
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Private</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={!content.trim() || createPostMutation.isPending}
              >
                {createPostMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
            
            <Input
              id="media-url-input"
              placeholder="Enter media URL (image or video)"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Post component
function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  
  // Like post mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to like post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Unlike post mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/posts/${post.id}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to unlike post",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/posts/${post.id}/comments`, { content });
      return response.json();
    },
    onSuccess: () => {
      setCommentContent("");
      setIsCommenting(false);
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add comment",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleLikeToggle = () => {
    const isLiked = post.likes.some(like => user && like.userId === user.id);
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };
  
  const handleCommentSubmit = () => {
    if (!commentContent.trim()) return;
    commentMutation.mutate(commentContent);
  };
  
  const isLiked = post.likes.some(like => user && like.userId === user.id);
  const visibleComments = showAllComments ? post.comments : post.comments.slice(0, 2);
  
  // Transform URLs into clickable links
  const renderContent = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Post header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.avatarUrl || ""} />
              <AvatarFallback>{post.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{post.fullName || post.username}</h3>
                {post.userId === user?.id && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center text-muted-foreground text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(post.createdAt)}</span>
                <span className="mx-1">•</span>
                <Globe className="h-3 w-3 mr-1" />
                <span>Public</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bookmark className="h-4 w-4 mr-2" />
                <span>Save post</span>
              </DropdownMenuItem>
              {post.userId === user?.id && (
                <>
                  <DropdownMenuItem>
                    <span>Edit post</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <span>Delete post</span>
                  </DropdownMenuItem>
                </>
              )}
              {post.userId !== user?.id && (
                <DropdownMenuItem>
                  <span>Report post</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Post content */}
        <div className="mb-4">
          <p className="whitespace-pre-line">{renderContent(post.content)}</p>
          
          {post.mediaUrl && (
            <div className="mt-3 rounded-md overflow-hidden">
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="w-full h-auto max-h-[400px] object-cover"
                onError={(e) => {
                  // If image fails to load, hide it
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Post stats */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center">
            <Heart className="h-3 w-3 fill-primary text-primary mr-1" />
            <span>{post.likes.length} like{post.likes.length !== 1 && 's'}</span>
          </div>
          <div>
            <span>{post.comments.length} comment{post.comments.length !== 1 && 's'}</span>
          </div>
        </div>
        
        {/* Post actions */}
        <div className="flex justify-between border-y py-2 mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={isLiked ? "text-primary" : ""}
            onClick={handleLikeToggle}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span>Like</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsCommenting(!isCommenting)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            <span>Share</span>
          </Button>
        </div>
        
        {/* Comment form */}
        <AnimatePresence>
          {isCommenting && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || ""} />
                  <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsCommenting(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleCommentSubmit}
                      disabled={!commentContent.trim() || commentMutation.isPending}
                    >
                      {commentMutation.isPending ? "Posting..." : "Post comment"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="space-y-3">
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.avatarUrl || ""} />
                  <AvatarFallback>{comment.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="font-medium text-sm">{comment.fullName || comment.username}</div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <button className="mr-2 hover:text-foreground">Like</button>
                    <button className="mr-2 hover:text-foreground">Reply</button>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {post.comments.length > 2 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground"
                onClick={() => setShowAllComments(!showAllComments)}
              >
                {showAllComments ? "Show less comments" : `View all ${post.comments.length} comments`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// User card for Who to Follow section
function UserFollowCard({ user: userData }: { user: User }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const followMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/users/${userData.id}/follow`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/suggested"] });
      toast({
        title: "Success",
        description: `You are now following ${userData.fullName || userData.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to follow user",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/users/${userData.id}/follow`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/suggested"] });
      toast({
        title: "Success",
        description: `You have unfollowed ${userData.fullName || userData.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to unfollow user",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleFollowToggle = () => {
    if (userData.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };
  
  // Skip rendering if it's the current user
  if (user && userData.id === user.id) return null;
  
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={userData.avatarUrl || ""} />
          <AvatarFallback>{userData.username?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{userData.fullName || userData.username}</div>
          <div className="text-xs text-muted-foreground">@{userData.username}</div>
        </div>
      </div>
      <Button 
        variant={userData.isFollowing ? "outline" : "default"} 
        size="sm"
        onClick={handleFollowToggle}
        disabled={followMutation.isPending || unfollowMutation.isPending}
      >
        {userData.isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}

// Trending topics
interface TrendingTopic {
  id: number;
  name: string;
  postCount: number;
}

function TrendingTopicsCard() {
  const trendingTopics: TrendingTopic[] = [
    { id: 1, name: "AI Technology", postCount: 1254 },
    { id: 2, name: "Digital Marketing", postCount: 875 },
    { id: 3, name: "Content Creation", postCount: 632 },
    { id: 4, name: "Personal Development", postCount: 521 },
    { id: 5, name: "Business Strategy", postCount: 487 },
  ];
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">#{topic.name}</div>
                <div className="text-xs text-muted-foreground">{topic.postCount} posts</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Explore
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SocialPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("forYou");
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  // Fetch posts
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery<Post[]>({
    queryKey: ["/api/posts", activeTab],
    queryFn: async () => {
      try {
        const url = activeTab === "forYou" 
          ? "/api/posts?feed=personalized" 
          : activeTab === "following" 
            ? "/api/posts?feed=following" 
            : "/api/posts";
            
        const response = await apiRequest("GET", url);
        
        if (response.status === 404) {
          // Endpoint not implemented yet, return placeholder data
          return [
            {
              id: 1,
              userId: 1,
              username: "stella_rodriguez",
              fullName: "Stella Rodriguez",
              avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
              content: "Just finished setting up my new AI content generator! 🚀 It's incredible how much time this saves. Who else is using AI to boost their productivity? #AITools #ContentCreation",
              likes: [{ id: 1, postId: 1, userId: 2, createdAt: new Date(Date.now() - 30 * 60000).toISOString() }],
              comments: [
                {
                  id: 1,
                  postId: 1,
                  userId: 2,
                  username: "david_chen",
                  fullName: "David Chen",
                  avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
                  content: "Which tool are you using? I've been comparing a few different options lately.",
                  createdAt: new Date(Date.now() - 25 * 60000).toISOString()
                }
              ],
              createdAt: new Date(Date.now() - 60 * 60000).toISOString()
            },
            {
              id: 2,
              userId: 3,
              username: "techguru",
              fullName: "Alex Thompson",
              avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
              content: "Just published a new article on how to integrate AI into your marketing workflow. Check it out at https://example.com/ai-marketing-tips\n\nLet me know what you think! #Marketing #AITips",
              mediaUrl: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
              likes: [
                { id: 2, postId: 2, userId: 1, createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
                { id: 3, postId: 2, userId: 4, createdAt: new Date(Date.now() - 10 * 60000).toISOString() },
              ],
              comments: [],
              createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
            },
            {
              id: 3,
              userId: 4,
              username: "samantha_lee",
              fullName: "Samantha Lee",
              avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
              content: "I just hit a major milestone with my e-commerce project using Echoverse tools! 🎉 Revenue is up 45% since implementing the AI product recommendations. Has anyone else seen similar results?",
              likes: [
                { id: 4, postId: 3, userId: 2, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
                { id: 5, postId: 3, userId: 3, createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
                { id: 6, postId: 3, userId: 5, createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
              ],
              comments: [
                {
                  id: 2,
                  postId: 3,
                  userId: 5,
                  username: "michael_smith",
                  fullName: "Michael Smith",
                  avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
                  content: "That's amazing! I'd love to hear more about your strategy. Would you be open to sharing some details?",
                  createdAt: new Date(Date.now() - 20 * 60000).toISOString()
                },
                {
                  id: 3,
                  postId: 3,
                  userId: 4,
                  username: "samantha_lee",
                  fullName: "Samantha Lee",
                  avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
                  content: "Absolutely! I used the product recommendation engine and customized it with our historical sales data. The key was fine-tuning the algorithm to prioritize related products instead of just popular ones.",
                  createdAt: new Date(Date.now() - 10 * 60000).toISOString()
                }
              ],
              createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
            }
          ];
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error("Failed to fetch posts. Please try again later.");
      }
    },
    refetchOnWindowFocus: false
  });
  
  // Fetch suggested users
  const { data: suggestedUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/suggested"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/users/suggested");
        
        if (response.status === 404) {
          // Endpoint not implemented yet, return placeholder data
          return [
            {
              id: 6,
              username: "emily_davis",
              fullName: "Emily Davis",
              avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
              role: "marketer",
              bio: "Digital marketing specialist. Love discussing content strategies and SEO.",
              followerCount: 342,
              followingCount: 251,
              isFollowing: false
            },
            {
              id: 7,
              username: "jasontech",
              fullName: "Jason Miller",
              avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
              role: "developer",
              bio: "Full stack developer. Currently building AI-powered web apps.",
              followerCount: 526,
              followingCount: 187,
              isFollowing: false
            },
            {
              id: 8,
              username: "sarah_marketing",
              fullName: "Sarah Wilson",
              avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg",
              role: "marketer",
              bio: "Growth marketing expert. I help startups scale their user acquisition.",
              followerCount: 873,
              followingCount: 412,
              isFollowing: false
            }
          ];
        }
        
        return await response.json();
      } catch (error) {
        console.error("Error fetching suggested users:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false
  });
  
  // Show error message if posts fetch fails
  useEffect(() => {
    if (postsError) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again later.",
        variant: "destructive",
      });
    }
  }, [postsError, toast]);
  
  if (!user) {
    return null; // Will redirect to login
  }
  
  const renderContent = () => {
    if (postsLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground mt-4">Loading posts...</p>
        </div>
      );
    }
    
    if (posts?.length === 0) {
      return (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-6">
            {activeTab === "forYou" 
              ? "Start following users or create your first post!" 
              : activeTab === "following" 
                ? "You're not following anyone yet. Discover new people to follow!" 
                : "Be the first to share something with the community!"}
          </p>
          {activeTab === "following" && (
            <Button 
              onClick={() => setActiveTab("discover")}
              className="mx-auto"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Discover people
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container py-6 max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Social Feed</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="forYou">For You</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="discover">Discover</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <CreatePostCard />
            
            {renderContent()}
          </div>
          
          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Who to follow */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Who to Follow
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : suggestedUsers?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No suggestions available</p>
                ) : (
                  <div className="space-y-4">
                    {suggestedUsers?.map((user) => (
                      <UserFollowCard key={user.id} user={user} />
                    ))}
                    <Button variant="outline" className="w-full text-sm">
                      See more
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Trending topics */}
            <TrendingTopicsCard />
            
            {/* Activity summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Posts</span>
                    </div>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Likes Given</span>
                    </div>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Likes Received</span>
                    </div>
                    <span className="font-medium">346</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">Followers</span>
                    </div>
                    <span className="font-medium">72</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}