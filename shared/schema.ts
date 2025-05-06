// shared/schema.ts
import { z } from "zod";

// User Schema (Database Representation)
export const userSchema = z.object({
  id: z.string().uuid(),                  // Unique identifier for the user
  username: z.string().min(3),             // Username (min length 3)
  email: z.string().email(),               // Valid email address
  password: z.string().min(6),             // Password (min length 6)
  createdAt: z.date(),                    // Timestamp for account creation
  updatedAt: z.date(),                    // Timestamp for last update
});

// Post Schema (Database Representation)
export const postSchema = z.object({
  id: z.string().uuid(),                  // Unique identifier for the post
  title: z.string().min(3),                // Post title (min length 3)
  content: z.string().min(10),             // Post content (min length 10)
  userId: z.string().uuid(),               // User associated with the post (foreign key)
  createdAt: z.date(),                    // Timestamp for post creation
  updatedAt: z.date(),                    // Timestamp for last update
});
