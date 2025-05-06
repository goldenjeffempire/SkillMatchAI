
import { Router } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../auth";

const router = Router();

// Get posts feed
router.get("/posts", isAuthenticated, async (req, res) => {
  try {
    const { filter = "recent", page = 1 } = req.query;
    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    let posts;
    switch (filter) {
      case "trending":
        posts = await storage.getTrendingPosts(limit, offset);
        break;
      case "following":
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
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// Create post
router.post("/posts", isAuthenticated, async (req, res) => {
  try {
    const { content, mediaUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = await storage.createPost({
      userId: req.user!.id,
      content,
      mediaUrl,
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
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
});

// Like/unlike post
router.post("/posts/:id/like", isAuthenticated, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    await storage.likePost(postId, req.user!.id);
    res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Failed to like post" });
  }
});

router.delete("/posts/:id/like", isAuthenticated, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    await storage.unlikePost(postId, req.user!.id);
    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Failed to unlike post" });
  }
});

// Add comment
router.post("/posts/:id/comments", isAuthenticated, async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const comment = await storage.createComment({
      postId,
      userId: req.user!.id,
      content,
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
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Failed to create comment" });
  }
});

export default router;
