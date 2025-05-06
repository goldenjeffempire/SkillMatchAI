
import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../auth';
import { z } from 'zod';

const router = Router();

const createPostSchema = z.object({
  content: z.string().min(1),
  mediaUrl: z.string().url().optional(),
});

// Get posts feed
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

        return {
          ...post,
          user: {
            id: user.id,
            name: user.fullName || user.username,
            avatar: user.avatar,
          },
          likes: likes.length,
          comments: comments.length,
          liked: likes.some((like) => like.userId === req.user!.id),
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
      liked: false,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

export default router;
