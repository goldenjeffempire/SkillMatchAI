
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { formatDistance } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PostProps {
  id: number;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
  onLike: () => void;
  onComment: (content: string) => void;
  onShare: () => void;
}

export function PostCard({ 
  id,
  content,
  mediaUrl,
  createdAt,
  likes,
  comments,
  shares,
  isLiked,
  user,
  onLike,
  onComment,
  onShare
}: PostProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    onLike();
  };

  const handleComment = () => {
    if (!commentText.trim()) {
      toast({
        title: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    onComment(commentText);
    setCommentText('');
    setIsCommenting(false);
  };

  const handleShare = () => {
    onShare();
    toast({
      title: "Post shared successfully!"
    });
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="whitespace-pre-wrap">{content}</p>
          {mediaUrl && (
            <img 
              src={mediaUrl} 
              alt="Post media" 
              className="mt-3 rounded-lg w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>

        {/* Post Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>{likes} likes</span>
          <span>{comments} comments</span>
          <span>{shares} shares</span>
        </div>

        {/* Post Actions */}
        <div className="flex justify-between border-t border-b py-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={isLiked ? "text-red-500" : ""}
          >
            <Heart className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
            Like
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsCommenting(!isCommenting)}
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Comment
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>

        {/* Comment Form */}
        <AnimatePresence>
          {isCommenting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px]"
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
                      onClick={handleComment}
                    >
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
