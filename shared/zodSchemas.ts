// shared/zodSchemas.ts
import { z } from "zod";

// User Creation Schema (Register User)
export const userCreateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot be more than 20 characters"),
  confirmPassword: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters")
    .max(20, "Password confirmation cannot be more than 20 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// User Login Schema (Login User)
export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// User Update Schema (Update User Details)
export const userUpdateSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot be more than 20 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters")
    .max(20, "Password confirmation cannot be more than 20 characters")
    .optional(),
}).refine((data) => {
  if (data.password && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Password Reset Schema (User Password Reset)
export const userPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot be more than 20 characters"),
  confirmPassword: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters")
    .max(20, "Password confirmation cannot be more than 20 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Post Creation Schema (Create a Post)
export const postCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  userId: z.string().uuid(),
});

// Post Update Schema (Update a Post)
export const postUpdateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  content: z.string().min(10, "Content must be at least 10 characters").optional(),
});
