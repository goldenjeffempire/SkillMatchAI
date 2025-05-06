import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { generateChatResponse, generateContent } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Create HTTP server
  const httpServer = createServer(app);

  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast function to send messages to all connected clients
  const broadcast = (message: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  // Posts routes
  app.get("/api/posts", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const posts = await storage.getAllPosts(limit, offset);
      
      // Get user info for each post
      const postsWithUser = await Promise.all(posts.map(async (post) => {
        const user = await storage.getUser(post.userId);
        const comments = await storage.getPostComments(post.id);
        const likes = await storage.getPostLikes(post.id);
        
        return {
          ...post,
          user: user ? { 
            id: user.id, 
            username: user.username, 
            fullName: user.fullName,
            avatar: user.avatar
          } : null,
          comments: comments.length,
          likes: likes.length
        };
      }));
      
      res.json(postsWithUser);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a post" });
      }

      const validatedData = insertPostSchema.safeParse({
        ...req.body,
        userId: req.user!.id
      });

      if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.errors });
      }

      const post = await storage.createPost(validatedData.data);
      
      // Get user info
      const user = await storage.getUser(post.userId);
      
      const postWithUser = {
        ...post,
        user: user ? { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          avatar: user.avatar
        } : null,
        comments: 0,
        likes: 0
      };
      
      // Broadcast new post to all connected clients
      broadcast({ type: 'new_post', post: postWithUser });
      
      res.status(201).json(postWithUser);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const user = await storage.getUser(post.userId);
      const comments = await storage.getPostComments(postId);
      const likes = await storage.getPostLikes(postId);
      
      const postWithDetails = {
        ...post,
        user: user ? { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          avatar: user.avatar
        } : null,
        comments: await Promise.all(comments.map(async (comment) => {
          const commentUser = await storage.getUser(comment.userId);
          return {
            ...comment,
            user: commentUser ? {
              id: commentUser.id,
              username: commentUser.username,
              fullName: commentUser.fullName,
              avatar: commentUser.avatar
            } : null
          };
        })),
        likes: likes.length,
        liked: req.isAuthenticated() ? likes.some(like => like.userId === req.user!.id) : false
      };
      
      res.json(postWithDetails);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Comments routes
  app.post("/api/posts/:id/comments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to comment" });
      }
      
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const validatedData = insertCommentSchema.safeParse({
        postId,
        userId: req.user!.id,
        content: req.body.content
      });
      
      if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.errors });
      }
      
      const comment = await storage.createComment(validatedData.data);
      
      // Get user info
      const user = await storage.getUser(comment.userId);
      
      const commentWithUser = {
        ...comment,
        user: user ? { 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          avatar: user.avatar
        } : null
      };
      
      // Broadcast new comment to all connected clients
      broadcast({ type: 'new_comment', postId, comment: commentWithUser });
      
      res.status(201).json(commentWithUser);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Likes routes
  app.post("/api/posts/:id/like", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to like a post" });
      }
      
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const likes = await storage.getPostLikes(postId);
      const existingLike = likes.find(like => like.userId === req.user!.id);
      
      if (existingLike) {
        return res.status(400).json({ message: "You already liked this post" });
      }
      
      const like = await storage.createLike({ postId, userId: req.user!.id });
      
      // Broadcast new like to all connected clients
      broadcast({ type: 'new_like', postId, like });
      
      res.status(201).json(like);
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:id/like", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to unlike a post" });
      }
      
      const postId = parseInt(req.params.id);
      
      if (isNaN(postId)) {
        return res.status(400).json({ message: "Invalid post ID" });
      }
      
      const post = await storage.getPostById(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      await storage.deleteLike(postId, req.user!.id);
      
      // Broadcast unlike to all connected clients
      broadcast({ type: 'unlike', postId, userId: req.user!.id });
      
      res.status(200).json({ message: "Post unliked" });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Books routes
  app.get("/api/books", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const books = await storage.getAllBooks(category, limit, offset);
      
      res.json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const bookId = parseInt(req.params.id);
      
      if (isNaN(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
      }
      
      const book = await storage.getBookById(bookId);
      
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      
      res.json(book);
    } catch (error) {
      console.error("Error fetching book:", error);
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  // User profile routes
  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...safeUser } = user;
      
      // Get user posts, followers, and following
      const posts = await storage.getUserPosts(user.id);
      const followers = await storage.getUserFollowers(user.id);
      const following = await storage.getUserFollowing(user.id);
      
      const userProfile = {
        ...safeUser,
        posts: posts.length,
        followers: followers.length,
        following: following.length,
        isFollowing: req.isAuthenticated() ? 
          followers.some(follow => follow.followerId === req.user!.id) : 
          false
      };
      
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // AI Chatbot route
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid messages format" });
      }
      
      // Get user info for personalization if authenticated
      let systemPrompt = "You are Echo, the helpful AI assistant for Echoverse platform. ";
      systemPrompt += "Echoverse is a comprehensive SaaS platform with AI tools like EchoWriter, EchoBuilder, EchoSeller, EchoMarketer, EchoTeacher, and EchoDevBot. ";
      systemPrompt += "Your goal is to help users understand and use these tools, provide assistance, and answer questions about Echoverse features. ";
      systemPrompt += "Keep responses helpful, friendly, and concise.";
      
      if (req.isAuthenticated()) {
        systemPrompt += ` The user's name is ${req.user!.username}.`;
      }
      
      // Format messages for OpenAI API
      const formattedMessages = messages.map((msg: any) => ({
        role: msg.sender === "user" ? "user" as const : "assistant" as const,
        content: msg.text
      }));
      
      const response = await generateChatResponse(formattedMessages, systemPrompt);
      
      res.json({ 
        text: response,
        id: Date.now().toString(),
        sender: "assistant",
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.status(500).json({ message: "Failed to generate chat response" });
    }
  });
  
  // Content Generation route
  app.post("/api/generate-content", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to generate content" });
      }
      
      const { prompt, type, context, options } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const content = await generateContent(prompt, context, { 
        type,
        ...options
      });
      
      res.json({ content });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Follow routes
  app.post("/api/users/:username/follow", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to follow a user" });
      }
      
      const userToFollow = await storage.getUserByUsername(req.params.username);
      
      if (!userToFollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (userToFollow.id === req.user!.id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
      
      const followers = await storage.getUserFollowers(userToFollow.id);
      const alreadyFollowing = followers.some(follow => follow.followerId === req.user!.id);
      
      if (alreadyFollowing) {
        return res.status(400).json({ message: "You are already following this user" });
      }
      
      const follow = await storage.followUser(req.user!.id, userToFollow.id);
      
      res.status(201).json(follow);
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  app.delete("/api/users/:username/follow", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to unfollow a user" });
      }
      
      const userToUnfollow = await storage.getUserByUsername(req.params.username);
      
      if (!userToUnfollow) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.unfollowUser(req.user!.id, userToUnfollow.id);
      
      res.status(200).json({ message: "User unfollowed" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Failed to unfollow user" });
    }
  });

  return httpServer;
}
