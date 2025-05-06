
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Share, MoreVertical } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    mediaUrl?: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
    timestamp: Date;
  };
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar src={post.user.avatar} alt={post.user.name} />
            <div>
              <h3 className="font-medium">{post.user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(post.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical size={20} />
          </Button>
        </div>

        <p className="mb-4">{post.content}</p>

        {post.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={post.mediaUrl} 
              alt="Post media" 
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="space-x-2"
            onClick={handleLike}
          >
            <Heart
              size={20}
              className={liked ? 'fill-red-500 text-red-500' : ''}
            />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageSquare size={20} />
            <span>{post.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="space-x-2">
            <Share size={20} />
            <span>{post.shares}</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
