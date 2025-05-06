import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { WebSocketServer } from "ws";
import { z } from "zod";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";
import { generateChatResponse, generateContent } from "./openai";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
      
      // Save the generated content to storage if successful
      if (content) {
        const aiContent = {
          userId: req.user!.id,
          title: options?.title || prompt.substring(0, 50),
          prompt,
          result: content,
          type: type || "general"
        };
        
        // We'll just return the content without storing it for now
        // to avoid complications with storage implementation
        res.json({ content, success: true });
      } else {
        throw new Error("Failed to generate content");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });
  
  // AI Tools routes
  // EchoBuilder Projects routes
  app.post("/api/projects", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a project" });
      }
      
      const { name, description, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
      }
      
      // For now, we'll simulate creating a project without storage
      res.status(201).json({
        id: Date.now(),
        userId: req.user!.id,
        name,
        description,
        type,
        settings: {},
        status: "draft",
        published: false,
        publishedUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  app.get("/api/projects", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your projects" });
      }
      
      // Return simulated projects for user
      res.json([
        {
          id: 1,
          userId: req.user!.id,
          name: "My Portfolio",
          description: "Professional portfolio website",
          type: "portfolio",
          settings: {},
          status: "published",
          published: true,
          publishedUrl: "https://example.com/portfolio",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)  // 2 days ago
        },
        {
          id: 2,
          userId: req.user!.id,
          name: "Business Website",
          description: "Company website for a small business",
          type: "business",
          settings: {},
          status: "draft",
          published: false,
          publishedUrl: null,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)  // 1 day ago
        }
      ]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  app.get("/api/projects/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view a project" });
      }
      
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      // Simulate getting a project by ID
      if (projectId === 1) {
        res.json({
          id: 1,
          userId: req.user!.id,
          name: "My Portfolio",
          description: "Professional portfolio website",
          type: "portfolio",
          settings: {
            colors: {
              primary: "#3498db",
              secondary: "#2ecc71",
              accent: "#9b59b6"
            },
            fonts: {
              heading: "Montserrat",
              body: "Open Sans"
            }
          },
          status: "published",
          published: true,
          publishedUrl: "https://example.com/portfolio",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          components: [
            {
              id: 1,
              projectId: 1,
              type: "header",
              content: {
                title: "John Developer",
                subtitle: "Full-stack Engineer",
                cta: "View My Work",
                backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
              },
              order: 0
            },
            {
              id: 2,
              projectId: 1,
              type: "about",
              content: {
                title: "About Me",
                description: "I'm a passionate developer with over 5 years of experience building web applications...",
                image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
              },
              order: 1
            },
            {
              id: 3,
              projectId: 1,
              type: "portfolio",
              content: {
                title: "My Projects",
                items: [
                  { title: "E-commerce Website", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c" },
                  { title: "Travel App", image: "https://images.unsplash.com/photo-1476067897447-d0c5df27b5df" },
                  { title: "Finance Dashboard", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71" }
                ]
              },
              order: 2
            }
          ]
        });
      } else if (projectId === 2) {
        res.json({
          id: 2,
          userId: req.user!.id,
          name: "Business Website",
          description: "Company website for a small business",
          type: "business",
          settings: {
            colors: {
              primary: "#e74c3c",
              secondary: "#f1c40f",
              accent: "#1abc9c"
            },
            fonts: {
              heading: "Roboto",
              body: "Lato"
            }
          },
          status: "draft",
          published: false,
          publishedUrl: null,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          components: [
            {
              id: 4,
              projectId: 2,
              type: "header",
              content: {
                title: "Acme Corp",
                subtitle: "Innovative Solutions for Modern Problems",
                cta: "Learn More",
                backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
              },
              order: 0
            },
            {
              id: 5,
              projectId: 2,
              type: "services",
              content: {
                title: "Our Services",
                services: [
                  { title: "Consulting", description: "Expert advice for your business", icon: "lightbulb" },
                  { title: "Development", description: "Custom software solutions", icon: "code" },
                  { title: "Support", description: "24/7 technical support", icon: "life-buoy" }
                ]
              },
              order: 1
            }
          ]
        });
      } else {
        return res.status(404).json({ message: "Project not found" });
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  app.put("/api/projects/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update a project" });
      }
      
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      const { name, description, settings, status, published } = req.body;
      
      // Simulate updating a project
      res.json({
        id: projectId,
        userId: req.user!.id,
        name: name || "Updated Project",
        description: description || "Updated description",
        type: "portfolio",
        settings: settings || {},
        status: status || "draft",
        published: published || false,
        publishedUrl: published ? `https://example.com/project-${projectId}` : null,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete a project" });
      }
      
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "Invalid project ID" });
      }
      
      // Simulate deleting a project
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  
  // Subscription and payment routes
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      // Return subscription plans
      res.json([
        {
          id: 1,
          name: "Free",
          description: "Basic access to Echoverse tools",
          features: [
            "Limited AI content generation",
            "Basic social features",
            "Access to free books"
          ],
          monthlyPrice: 0,
          yearlyPrice: 0,
          stripePriceIdMonthly: null,
          stripePriceIdYearly: null
        },
        {
          id: 2,
          name: "Pro",
          description: "Advanced features for professionals",
          features: [
            "Unlimited AI content generation",
            "Full access to all tools and templates",
            "Access to premium books",
            "Priority support"
          ],
          monthlyPrice: 1999, // $19.99
          yearlyPrice: 19999, // $199.99
          stripePriceIdMonthly: "price_monthly_pro",
          stripePriceIdYearly: "price_yearly_pro"
        },
        {
          id: 3,
          name: "Enterprise",
          description: "Complete solution for businesses",
          features: [
            "Everything in Pro",
            "Team collaboration features",
            "Advanced analytics",
            "Dedicated account manager",
            "Custom branding options"
          ],
          monthlyPrice: 4999, // $49.99
          yearlyPrice: 49999, // $499.99
          stripePriceIdMonthly: "price_monthly_enterprise",
          stripePriceIdYearly: "price_yearly_enterprise"
        }
      ]);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });
  
  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to make a payment" });
      }
      
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user!.id.toString()
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  
  // Stripe subscription endpoint
  app.post('/api/create-subscription', async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to subscribe" });
      }
      
      const { planId, interval } = req.body;
      
      if (!planId || !interval || !['month', 'year'].includes(interval)) {
        return res.status(400).json({ message: "Missing or invalid planId or interval" });
      }
      
      const user = req.user!;
      
      // For simplicity, using predefined price IDs
      let priceId;
      if (planId === 2) { // Pro plan
        priceId = interval === 'month' ? 'price_monthly_pro' : 'price_yearly_pro';
      } else if (planId === 3) { // Enterprise plan
        priceId = interval === 'month' ? 'price_monthly_enterprise' : 'price_yearly_enterprise';
      } else {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      // Check if user already has a Stripe customer ID
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.fullName || user.username,
          metadata: {
            userId: user.id.toString()
          }
        });
        
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        // In a real implementation, this would update the user in the database
        // await storage.updateStripeCustomerId(user.id, customerId);
      }
      
      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      // For now, we'll simulate updating the user's subscription info without actually storing it
      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });
  
  // Webhook for handling Stripe events
  app.post('/api/stripe-webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // In a real implementation, we would verify the webhook signature
    // if (!endpointSecret) {
    //   return res.status(400).send('Webhook secret not configured');
    // }
    
    let event;
    
    try {
      // Simulate receiving and processing an event
      const jsonBody = req.body;
      event = {
        type: jsonBody.type,
        data: { object: jsonBody.data }
      };
      
      // Handle specific event types
      switch (event.type) {
        case 'checkout.session.completed':
          // Handle completed checkout session
          console.log('Checkout completed');
          break;
          
        case 'invoice.paid':
          // Handle successful payment
          console.log('Invoice paid');
          break;
          
        case 'invoice.payment_failed':
          // Handle failed payment
          console.log('Payment failed');
          break;
          
        case 'customer.subscription.updated':
          // Handle subscription update
          console.log('Subscription updated');
          break;
          
        case 'customer.subscription.deleted':
          // Handle subscription cancellation
          console.log('Subscription cancelled');
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.status(200).json({ received: true });
    } catch (err: any) {
      console.error(`Webhook error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
  
  app.get("/api/ai-tools", (req, res) => {
    // Return available AI tools
    const tools = [
      {
        id: "echowriter",
        name: "EchoWriter",
        description: "Create blog posts, articles, and stories with AI assistance.",
        icon: "pencil-line",
        templates: [
          { id: "blog-post", name: "Blog Post", prompt: "Write a blog post about [topic]" },
          { id: "product-description", name: "Product Description", prompt: "Write a compelling product description for [product]" },
          { id: "social-media", name: "Social Media Post", prompt: "Create a social media post about [topic]" }
        ]
      },
      {
        id: "echobuilder",
        name: "EchoBuilder",
        description: "Build websites and landing pages by describing what you want.",
        icon: "layout",
        templates: [
          { id: "business-site", name: "Business Website", prompt: "Create a website for a [business type] business" },
          { id: "portfolio", name: "Portfolio", prompt: "Create a portfolio website for a [profession]" },
          { id: "landing-page", name: "Landing Page", prompt: "Create a landing page for [product/service]" }
        ]
      },
      {
        id: "echoseller",
        name: "EchoSeller",
        description: "Generate compelling marketing copy and sales materials.",
        icon: "shopping-cart",
        templates: [
          { id: "sales-email", name: "Sales Email", prompt: "Write a sales email for [product/service]" },
          { id: "ad-copy", name: "Ad Copy", prompt: "Write ad copy for [product/service]" },
          { id: "product-launch", name: "Product Launch", prompt: "Create a product launch announcement for [product]" }
        ]
      },
      {
        id: "echomarketer",
        name: "EchoMarketer",
        description: "Create marketing strategies and campaign ideas.",
        icon: "megaphone",
        templates: [
          { id: "marketing-plan", name: "Marketing Plan", prompt: "Create a marketing plan for [business/product]" },
          { id: "campaign-ideas", name: "Campaign Ideas", prompt: "Generate campaign ideas for [business/product]" },
          { id: "social-strategy", name: "Social Media Strategy", prompt: "Develop a social media strategy for [business]" }
        ]
      },
      {
        id: "echoteacher",
        name: "EchoTeacher",
        description: "Generate learning materials and educational content.",
        icon: "graduation-cap",
        templates: [
          { id: "lesson-plan", name: "Lesson Plan", prompt: "Create a lesson plan for teaching [subject]" },
          { id: "study-guide", name: "Study Guide", prompt: "Generate a study guide for [subject]" },
          { id: "quiz", name: "Quiz", prompt: "Create a quiz about [subject]" }
        ]
      },
      {
        id: "echodevbot",
        name: "EchoDevBot",
        description: "Get help with coding and software development tasks.",
        icon: "code",
        templates: [
          { id: "code-snippet", name: "Code Snippet", prompt: "Write a code snippet to [functionality] in [language]" },
          { id: "debug-help", name: "Debug Help", prompt: "Help me debug this code: [paste code]" },
          { id: "architecture", name: "Architecture", prompt: "Design an architecture for [application type]" }
        ]
      }
    ];
    
    res.json(tools);
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
