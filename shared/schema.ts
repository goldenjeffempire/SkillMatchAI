import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey, date, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export type AuthProviderType = "google" | "github" | "credentials";

// User model with enhanced fields for authentication and profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),  // Can be null for social login
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  fullName: text("full_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),  // user, student, parent, developer, admin
  bio: text("bio"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  onboardingStep: integer("onboarding_step").default(1),
  preferences: jsonb("preferences").default({}),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionTier: text("subscription_tier").default("free"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Social auth accounts linked to users
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(), // "google", "github"
  providerAccountId: text("provider_account_id").notNull(), 
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    providerIdx: uniqueIndex("provider_idx").on(table.provider, table.providerAccountId),
  };
});

// Sessions for users
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User role permissions
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: text("role").notNull().unique(),
  permissions: jsonb("permissions").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    password: true,
    email: true,
    fullName: true,
    firstName: true,
    lastName: true,
    role: true,
  })
  .extend({
    confirmPassword: z.string().optional(),
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

// Social feed enhance tables
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shares = pgTable("shares", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: text("platform"), // facebook, twitter, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// News feed 
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // like, comment, follow, mention, etc.
  content: text("content").notNull(),
  read: boolean("read").default(false),
  relatedUserId: integer("related_user_id").references(() => users.id, { onDelete: "cascade" }),
  relatedPostId: integer("related_post_id").references(() => posts.id, { onDelete: "cascade" }),
  relatedCommentId: integer("related_comment_id").references(() => comments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reading progress for books
export const readingProgress = pgTable("reading_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  progress: integer("progress").default(0), // percentage 0-100
  lastReadAt: timestamp("last_read_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reading goals
export const readingGoals = pgTable("reading_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  goalType: text("goal_type").notNull(), // daily, weekly, monthly
  targetValue: integer("target_value").notNull(), // number of books, pages, minutes
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  completed: boolean("completed").default(false),
  progress: integer("progress").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Website templates for EchoBuilder
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  category: text("category").notNull(), // blog, portfolio, store, etc.
  content: jsonb("content").notNull(), // template data structure
  isPublic: boolean("is_public").default(true),
  creatorId: integer("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// E-Commerce products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  images: jsonb("images").default([]),
  category: text("category"),
  tags: jsonb("tags").default([]),
  inventory: integer("inventory"),
  published: boolean("published").default(false),
  stripePriceId: text("stripe_price_id"),
  stripeProductId: text("stripe_product_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews for products
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // pending, paid, shipped, delivered, cancelled
  total: integer("total").notNull(), // in cents
  paymentIntentId: text("payment_intent_id"),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // in cents at time of purchase
  createdAt: timestamp("created_at").defaultNow(),
});

// Courses for learning portal
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  instructorId: integer("instructor_id").notNull().references(() => users.id),
  thumbnail: text("thumbnail"),
  level: text("level").default("beginner"), // beginner, intermediate, advanced
  category: text("category"),
  duration: integer("duration"), // in minutes
  isPublished: boolean("is_published").default(false),
  price: integer("price"), // in cents, null if free
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lessons within courses
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: text("video_url"),
  duration: integer("duration"), // in minutes
  order: integer("order").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quizzes for lessons
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").notNull(), // Array of question objects
  passingScore: integer("passing_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User enrollments in courses
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  progress: integer("progress").default(0), // percentage 0-100
});

// Job board listings
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  postedById: integer("posted_by_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(), // full-time, part-time, contract, etc.
  description: text("description").notNull(),
  requirements: jsonb("requirements"),
  salary: jsonb("salary"), // { min, max, currency }
  applicationUrl: text("application_url"),
  contactEmail: text("contact_email"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status").default("submitted"), // submitted, reviewed, interviewing, accepted, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Marketplace items (agents, templates, themes)
export const marketplaceItems = pgTable("marketplace_items", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  type: text("type").notNull(), // agent, template, theme
  category: text("category"),
  thumbnail: text("thumbnail"),
  downloadUrl: text("download_url"),
  demoUrl: text("demo_url"),
  published: boolean("published").default(false),
  downloads: integer("downloads").default(0),
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Marketplace purchases
export const marketplacePurchases = pgTable("marketplace_purchases", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull().references(() => marketplaceItems.id),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  transactionId: text("transaction_id"), // Stripe payment intent ID
  amount: integer("amount").notNull(), // in cents
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Calendar events
export const calendarEvents = pgTable("calendar_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  allDay: boolean("all_day").default(false),
  location: text("location"),
  videoMeetingUrl: text("video_meeting_url"),
  color: text("color").default("#3788d8"),
  reminderMinutes: integer("reminder_minutes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types for accounts
export const insertAccountSchema = createInsertSchema(accounts);
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;

// Types for sessions
export const insertSessionSchema = createInsertSchema(sessions);
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;

// Types for role permissions
export const insertRolePermissionSchema = createInsertSchema(rolePermissions);
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

// Type exports for existing tables
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
