import { 
  users, posts, comments, likes, books, follows, aiContents, projects, projectComponents, subscriptionPlans,
  type User, type InsertUser, type Post, type Comment, type Like, type Book, type Follow,
  type AiContent, type InsertAiContent, type Project, type InsertProject, 
  type ProjectComponent, type InsertProjectComponent, type SubscriptionPlan, type InsertSubscriptionPlan
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<Omit<User, "id" | "password">>): Promise<User>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User>;
  updateStripeSubscriptionInfo(userId: number, subscriptionInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;
  
  // Posts methods
  createPost(post: { userId: number; content: string; mediaUrl?: string }): Promise<Post>;
  getPostById(id: number): Promise<Post | undefined>;
  getAllPosts(limit?: number, offset?: number): Promise<Post[]>;
  getUserPosts(userId: number): Promise<Post[]>;
  
  // Comments methods
  createComment(comment: { postId: number; userId: number; content: string }): Promise<Comment>;
  getPostComments(postId: number): Promise<Comment[]>;
  
  // Likes methods
  createLike(like: { postId: number; userId: number }): Promise<Like>;
  deleteLike(postId: number, userId: number): Promise<void>;
  getPostLikes(postId: number): Promise<Like[]>;
  
  // Books methods
  getAllBooks(category?: string, limit?: number, offset?: number): Promise<Book[]>;
  getBookById(id: number): Promise<Book | undefined>;
  
  // Follow methods
  followUser(followerId: number, followingId: number): Promise<Follow>;
  unfollowUser(followerId: number, followingId: number): Promise<void>;
  getUserFollowers(userId: number): Promise<Follow[]>;
  getUserFollowing(userId: number): Promise<Follow[]>;
  
  // AI Content methods
  createAiContent(content: InsertAiContent): Promise<AiContent>;
  getAiContentById(id: number): Promise<AiContent | undefined>;
  getUserAiContents(userId: number, type?: string): Promise<AiContent[]>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProjectById(id: number): Promise<Project | undefined>;
  getUserProjects(userId: number): Promise<Project[]>;
  updateProject(id: number, project: Partial<Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Project Components methods
  createProjectComponent(component: InsertProjectComponent): Promise<ProjectComponent>;
  getProjectComponents(projectId: number): Promise<ProjectComponent[]>;
  updateProjectComponent(id: number, component: Partial<Omit<ProjectComponent, "id" | "projectId" | "createdAt">>): Promise<ProjectComponent>;
  deleteProjectComponent(id: number): Promise<void>;
  
  // Subscription methods
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined>;
  
  // Session store
  sessionStore: any; // Using any for session store type
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private postsMap: Map<number, Post>;
  private commentsMap: Map<number, Comment>;
  private likesMap: Map<number, Like>;
  private booksMap: Map<number, Book>;
  private followsMap: Map<number, Follow>;
  private aiContentsMap: Map<number, AiContent>;
  private projectsMap: Map<number, Project>;
  private projectComponentsMap: Map<number, ProjectComponent>;
  private subscriptionPlansMap: Map<number, SubscriptionPlan>;
  currentId: number;
  sessionStore: any; // Using any to bypass the typing error

  constructor() {
    this.usersMap = new Map();
    this.postsMap = new Map();
    this.commentsMap = new Map();
    this.likesMap = new Map();
    this.booksMap = new Map();
    this.followsMap = new Map();
    this.aiContentsMap = new Map();
    this.projectsMap = new Map();
    this.projectComponentsMap = new Map();
    this.subscriptionPlansMap = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      avatar: null,
      bio: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionTier: null,
      role: insertUser.role || "user",
      fullName: insertUser.fullName || null
    };
    this.usersMap.set(id, user);
    return user;
  }

  async createPost(post: { userId: number; content: string; mediaUrl?: string }): Promise<Post> {
    const id = this.currentId++;
    const createdAt = new Date();
    const newPost: Post = { 
      ...post, 
      id, 
      createdAt,
      mediaUrl: post.mediaUrl || null 
    };
    this.postsMap.set(id, newPost);
    return newPost;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.postsMap.get(id);
  }

  async getAllPosts(limit = 10, offset = 0): Promise<Post[]> {
    return Array.from(this.postsMap.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return Array.from(this.postsMap.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createComment(comment: { postId: number; userId: number; content: string }): Promise<Comment> {
    const id = this.currentId++;
    const createdAt = new Date();
    const newComment: Comment = { ...comment, id, createdAt };
    this.commentsMap.set(id, newComment);
    return newComment;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return Array.from(this.commentsMap.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createLike(like: { postId: number; userId: number }): Promise<Like> {
    const id = this.currentId++;
    const createdAt = new Date();
    const newLike: Like = { ...like, id, createdAt };
    this.likesMap.set(id, newLike);
    return newLike;
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    const likeToDelete = Array.from(this.likesMap.values()).find(
      like => like.postId === postId && like.userId === userId
    );
    
    if (likeToDelete) {
      this.likesMap.delete(likeToDelete.id);
    }
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    return Array.from(this.likesMap.values())
      .filter(like => like.postId === postId);
  }

  async getAllBooks(category?: string, limit = 10, offset = 0): Promise<Book[]> {
    let books = Array.from(this.booksMap.values());
    
    if (category) {
      books = books.filter(book => book.category === category);
    }
    
    return books
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }

  async getBookById(id: number): Promise<Book | undefined> {
    return this.booksMap.get(id);
  }

  async followUser(followerId: number, followingId: number): Promise<Follow> {
    const id = this.currentId++;
    const createdAt = new Date();
    const follow: Follow = { id, followerId, followingId, createdAt };
    this.followsMap.set(id, follow);
    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    const followToDelete = Array.from(this.followsMap.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
    
    if (followToDelete) {
      this.followsMap.delete(followToDelete.id);
    }
  }

  async getUserFollowers(userId: number): Promise<Follow[]> {
    return Array.from(this.followsMap.values())
      .filter(follow => follow.followingId === userId);
  }

  async getUserFollowing(userId: number): Promise<Follow[]> {
    return Array.from(this.followsMap.values())
      .filter(follow => follow.followerId === userId);
  }

  // Project methods
  async createProject(project: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newProject: Project = { 
      ...project, 
      id, 
      createdAt, 
      updatedAt,
      status: project.status || "draft",
      description: project.description || null,
      settings: project.settings || {},
      published: project.published || false,
      publishedUrl: project.publishedUrl || null
    };
    this.projectsMap.set(id, newProject);
    return newProject;
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projectsMap.get(id);
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projectsMap.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async updateProject(id: number, projectData: Partial<Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Project> {
    const project = this.projectsMap.get(id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const updatedProject: Project = {
      ...project,
      ...projectData,
      updatedAt: new Date()
    };
    
    this.projectsMap.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    const project = this.projectsMap.get(id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    // Delete the project
    this.projectsMap.delete(id);
    
    // Delete all components associated with this project
    const componentsToDelete = Array.from(this.projectComponentsMap.values())
      .filter(component => component.projectId === id)
      .map(component => component.id);
    
    componentsToDelete.forEach(componentId => {
      this.projectComponentsMap.delete(componentId);
    });
  }

  // Project Components methods
  async createProjectComponent(component: InsertProjectComponent): Promise<ProjectComponent> {
    const id = this.currentId++;
    const createdAt = new Date();
    const newComponent: ProjectComponent = { ...component, id, createdAt };
    this.projectComponentsMap.set(id, newComponent);
    return newComponent;
  }

  async getProjectComponents(projectId: number): Promise<ProjectComponent[]> {
    return Array.from(this.projectComponentsMap.values())
      .filter(component => component.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async updateProjectComponent(id: number, componentData: Partial<Omit<ProjectComponent, "id" | "projectId" | "createdAt">>): Promise<ProjectComponent> {
    const component = this.projectComponentsMap.get(id);
    if (!component) {
      throw new Error(`Project component with id ${id} not found`);
    }
    
    const updatedComponent: ProjectComponent = {
      ...component,
      ...componentData
    };
    
    this.projectComponentsMap.set(id, updatedComponent);
    return updatedComponent;
  }

  async deleteProjectComponent(id: number): Promise<void> {
    this.projectComponentsMap.delete(id);
  }

  // Subscription methods
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlansMap.values());
  }

  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlansMap.get(id);
  }

  async getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined> {
    return Array.from(this.subscriptionPlansMap.values())
      .find(plan => plan.name === name);
  }

  // User update methods
  async updateUser(id: number, userData: Partial<Omit<User, "id" | "password">>): Promise<User> {
    const user = this.usersMap.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = {
      ...user,
      ...userData
    };
    
    this.usersMap.set(id, updatedUser);
    return updatedUser;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    return this.updateUser(userId, { stripeCustomerId });
  }

  async updateStripeSubscriptionInfo(userId: number, subscriptionInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    return this.updateUser(userId, subscriptionInfo);
  }

  // AI Content methods
  async createAiContent(content: InsertAiContent): Promise<AiContent> {
    const id = this.currentId++;
    const createdAt = new Date();
    const newAiContent: AiContent = { ...content, id, createdAt };
    this.aiContentsMap.set(id, newAiContent);
    return newAiContent;
  }

  async getAiContentById(id: number): Promise<AiContent | undefined> {
    return this.aiContentsMap.get(id);
  }

  async getUserAiContents(userId: number, type?: string): Promise<AiContent[]> {
    let userContents = Array.from(this.aiContentsMap.values())
      .filter(content => content.userId === userId);
    
    if (type) {
      userContents = userContents.filter(content => content.type === type);
    }
    
    return userContents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

import connectPg from "connect-pg-simple";
import { pool, db } from "./db";

const PostgresSessionStore = connectPg(session);

// Add a database storage implementation that uses the actual database
export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: 'session' 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<Omit<User, "id" | "password">>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    return this.updateUser(userId, { stripeCustomerId });
  }

  async updateStripeSubscriptionInfo(userId: number, subscriptionInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    return this.updateUser(userId, subscriptionInfo);
  }

  // Posts methods
  async createPost(post: { userId: number; content: string; mediaUrl?: string }): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getAllPosts(limit = 10, offset = 0): Promise<Post[]> {
    return db.select()
      .from(posts)
      .orderBy(posts.createdAt)
      .limit(limit)
      .offset(offset);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return db.select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(posts.createdAt);
  }

  // Comments methods
  async createComment(comment: { postId: number; userId: number; content: string }): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return db.select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);
  }

  // Likes methods
  async createLike(like: { postId: number; userId: number }): Promise<Like> {
    const [newLike] = await db.insert(likes).values(like).returning();
    return newLike;
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    await db.delete(likes).where(
      and(
        eq(likes.postId, postId),
        eq(likes.userId, userId)
      )
    );
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    return db.select()
      .from(likes)
      .where(eq(likes.postId, postId));
  }

  // Books methods
  async getAllBooks(category?: string, limit = 10, offset = 0): Promise<Book[]> {
    let query = db.select().from(books);
    
    if (category) {
      query = query.where(eq(books.category, category));
    }
    
    return query
      .orderBy(books.createdAt)
      .limit(limit)
      .offset(offset);
  }

  async getBookById(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  // Follow methods
  async followUser(followerId: number, followingId: number): Promise<Follow> {
    const [follow] = await db.insert(follows)
      .values({ followerId, followingId })
      .returning();
    
    return follow;
  }

  async unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db.delete(follows).where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      )
    );
  }

  async getUserFollowers(userId: number): Promise<Follow[]> {
    return db.select()
      .from(follows)
      .where(eq(follows.followingId, userId));
  }

  async getUserFollowing(userId: number): Promise<Follow[]> {
    return db.select()
      .from(follows)
      .where(eq(follows.followerId, userId));
  }

  // AI Content methods
  async createAiContent(content: InsertAiContent): Promise<AiContent> {
    const [newContent] = await db.insert(aiContents).values(content).returning();
    return newContent;
  }

  async getAiContentById(id: number): Promise<AiContent | undefined> {
    const [content] = await db.select().from(aiContents).where(eq(aiContents.id, id));
    return content;
  }

  async getUserAiContents(userId: number, type?: string): Promise<AiContent[]> {
    let query = db.select().from(aiContents).where(eq(aiContents.userId, userId));
    
    if (type) {
      query = query.where(eq(aiContents.type, type));
    }
    
    return query.orderBy(aiContents.createdAt);
  }

  // Project methods
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getUserProjects(userId: number): Promise<Project[]> {
    return db.select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.updatedAt);
  }

  async updateProject(id: number, project: Partial<Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    // Delete related components first
    await db.delete(projectComponents).where(eq(projectComponents.projectId, id));
    
    // Delete the project
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Project Components methods
  async createProjectComponent(component: InsertProjectComponent): Promise<ProjectComponent> {
    const [newComponent] = await db.insert(projectComponents).values(component).returning();
    return newComponent;
  }

  async getProjectComponents(projectId: number): Promise<ProjectComponent[]> {
    return db.select()
      .from(projectComponents)
      .where(eq(projectComponents.projectId, projectId))
      .orderBy(projectComponents.order);
  }

  async updateProjectComponent(id: number, component: Partial<Omit<ProjectComponent, "id" | "projectId" | "createdAt">>): Promise<ProjectComponent> {
    const [updatedComponent] = await db
      .update(projectComponents)
      .set(component)
      .where(eq(projectComponents.id, id))
      .returning();
    
    return updatedComponent;
  }

  async deleteProjectComponent(id: number): Promise<void> {
    await db.delete(projectComponents).where(eq(projectComponents.id, id));
  }

  // Subscription methods
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans);
  }

  async getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getSubscriptionPlanByName(name: string): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.name, name));
    return plan;
  }
}

export const storage = new DatabaseStorage();
