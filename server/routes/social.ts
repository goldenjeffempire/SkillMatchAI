
import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../auth';
import { z } from 'zod';

const router = Router();

const createPostSchema = z.object({
  content: z.string().min(1),
  mediaUrl: z.string().url().optional(),
  type: z.enum(['text', 'image', 'video']).default('text'),
});

const commentSchema = z.object({
  content: z.string().min(1),
});

// Get posts feed with filters
router.get('/posts', isAuthenticated, async (req, res) => {
  try {
    const { filter = 'recent', page = 1 } = req.query;
    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    let posts;
    switch (filter) {
      case 'trending':
        posts = await storage.getTrendingPosts(limit, offset);
        break;
      case 'following':
        posts = await storage.getFollowingPosts(req.user!.id, limit, offset);
        break;
      default:
        posts = await storage.getRecentPosts(limit, offset);
    }

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const likes = await storage.getPostLikes(post.id);
        const comments = await storage.getPostComments(post.id);
        const shares = await storage.getPostShares(post.id);

        return {
          ...post,
          user: {
            id: user.id,
            name: user.fullName || user.username,
            avatar: user.avatar,
          },
          likes: likes.length,
          comments: comments.length,
          shares: shares.length,
          liked: likes.some((like) => like.userId === req.user!.id),
          shared: shares.some((share) => share.userId === req.user!.id),
        };
      })
    );

    res.json(postsWithMeta);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Create post
router.post('/posts', isAuthenticated, async (req, res) => {
  try {
    const data = createPostSchema.parse(req.body);
    const post = await storage.createPost({
      userId: req.user!.id,
      ...data,
    });

    const user = await storage.getUser(post.userId);
    
    res.status(201).json({
      ...post,
      user: {
        id: user.id,
        name: user.fullName || user.username,
        avatar: user.avatar,
      },
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      shared: false,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// Like/Unlike post
router.post('/posts/:postId/like', isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const liked = await storage.togglePostLike(postId, userId);
    res.json({ liked });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

// Share post
router.post('/posts/:postId/share', isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.user!.id;
    
    const shared = await storage.sharePost(postId, userId);
    res.json({ shared });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ message: 'Failed to share post' });
  }
});

// Add comment
router.post('/posts/:postId/comments', isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const data = commentSchema.parse(req.body);
    
    const comment = await storage.createComment({
      postId,
      userId: req.user!.id,
      content: data.content,
    });

    const user = await storage.getUser(comment.userId);
    
    res.status(201).json({
      ...comment,
      user: {
        id: user.id,
        name: user.fullName || user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
});

export default router;
