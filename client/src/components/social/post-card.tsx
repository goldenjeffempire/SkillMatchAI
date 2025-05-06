
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share, SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    mediaUrl?: string;
    type: 'text' | 'image' | 'video';
    createdAt: string;
    user: {
      id: number;
      name: string;
      avatar: string;
    };
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    shared: boolean;
  };
}

export function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/social/posts/${post.id}/like`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/social/posts/${post.id}/share`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
      toast({
        title: "Post shared",
        description: "The post has been shared to your profile.",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/social/posts/${post.id}/comments`, {
        content: comment,
      });
      return res.json();
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/social/posts"] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{post.user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="whitespace-pre-wrap mb-4">{post.content}</p>
          
          {post.mediaUrl && (
            <div className="rounded-lg overflow-hidden mb-4">
              {post.type === 'image' ? (
                <img src={post.mediaUrl} alt="" className="w-full" />
              ) : (
                <video src={post.mediaUrl} controls className="w-full" />
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-center gap-2 w-full">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => likeMutation.mutate()}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${post.liked ? "fill-primary text-primary" : ""}`}
              />
              Like
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => shareMutation.mutate()}
            >
              <Share
                className={`w-4 h-4 mr-2 ${post.shared ? "text-primary" : ""}`}
              />
              Share
            </Button>
          </div>
          
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full"
              >
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={() => commentMutation.mutate()}
                    disabled={!comment.trim()}
                  >
                    <SendHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
