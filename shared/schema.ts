import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  bio: text("bio"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

// Posts for social feed
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  mediaUrl: text("media_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPostSchema = createInsertSchema(posts).pick({
  userId: true,
  content: true,
  mediaUrl: true,
});

// Comments on posts
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).pick({
  postId: true,
  userId: true,
  content: true,
});

// Likes on posts
export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLikeSchema = createInsertSchema(likes).pick({
  postId: true,
  userId: true,
});

// Books in the library
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverImage: text("cover_image"),
  category: text("category").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  readTime: integer("read_time"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  createdAt: true,
});

// User follows
export const follows = pgTable("follows", {
  id: serial("id").primaryKey(),
  followerId: integer("follower_id").notNull().references(() => users.id),
  followingId: integer("following_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFollowSchema = createInsertSchema(follows).pick({
  followerId: true,
  followingId: true,
});

// AI Content models
export const aiContents = pgTable("ai_contents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  prompt: text("prompt").notNull(),
  result: text("result").notNull(),
  type: text("type").notNull(), // blog, marketing, code, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiContentSchema = createInsertSchema(aiContents).omit({
  id: true,
  createdAt: true,
});

// Projects model for EchoBuilder
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // website, app, landing-page, etc.
  settings: jsonb("settings"), // JSON settings for the project
  status: text("status").notNull().default("draft"),
  published: boolean("published").notNull().default(false),
  publishedUrl: text("published_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Project components
export const projectComponents = pgTable("project_components", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  type: text("type").notNull(), // header, section, footer, etc.
  content: jsonb("content").notNull(), // JSON content for the component
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectComponentSchema = createInsertSchema(projectComponents).omit({
  id: true,
  createdAt: true,
});

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  features: jsonb("features").notNull(), // JSON array of features
  monthlyPrice: integer("monthly_price").notNull(),
  yearlyPrice: integer("yearly_price").notNull(),
  stripePriceIdMonthly: text("stripe_price_id_monthly"),
  stripePriceIdYearly: text("stripe_price_id_yearly"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type Book = typeof books.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type AiContent = typeof aiContents.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectComponent = typeof projectComponents.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertLike = z.infer<typeof insertLikeSchema>;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type InsertFollow = z.infer<typeof insertFollowSchema>;
export type InsertAiContent = z.infer<typeof insertAiContentSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertProjectComponent = z.infer<typeof insertProjectComponentSchema>;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
