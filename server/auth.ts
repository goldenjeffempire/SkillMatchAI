import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { 
  User, InsertUser, Account,
  users, accounts 
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import nodemailer from "nodemailer";

declare global {
  namespace Express {
    interface User extends Omit<User, "password"> {}
  }
}

// Security utilities
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Email verification and password reset functions
async function sendVerificationEmail(user: User, origin: string): Promise<void> {
  // This is just a placeholder - in a real app, you'd configure a real mail service
  // For development, use a service like Ethereal or Mailtrap
  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const verificationToken = uuidv4();

  // Store the verification token in the database
  await db.update(users)
    .set({ verificationToken })
    .where(eq(users.id, user.id));

  const verificationUrl = `${origin}/verify-email?token=${verificationToken}`;

  const info = await transporter.sendMail({
    from: '"Echoverse" <no-reply@echoverse.com>',
    to: user.email,
    subject: "Verify your email address",
    text: `Please verify your email address by clicking this link: ${verificationUrl}`,
    html: `<p>Please verify your email address by clicking this link: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
  });

  console.log("Verification email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

async function sendPasswordResetEmail(email: string, origin: string): Promise<void> {
  const user = await storage.getUserByEmail(email);
  if (!user) return; // Don't reveal if the email exists

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour

  // Store the reset token and expiry in the database
  await db.update(users)
    .set({ 
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    })
    .where(eq(users.id, user.id));

  const resetUrl = `${origin}/reset-password?token=${resetToken}`;

  const info = await transporter.sendMail({
    from: '"Echoverse" <no-reply@echoverse.com>',
    to: user.email,
    subject: "Reset your password",
    text: `Reset your password by clicking this link: ${resetUrl}. This link is valid for 1 hour.`,
    html: `<p>Reset your password by clicking this link: <a href="${resetUrl}">${resetUrl}</a>. This link is valid for 1 hour.</p>`,
  });

  console.log("Password reset email sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Authentication middleware
export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
}

export function setupAuth(app: Express): void {
  // Configure session management
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy (username/password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          // Check if the username exists
          const user = await storage.getUserByUsername(username);
          if (!user || !user.password) {
            return done(null, false, { message: "Invalid username or password" });
          }

          // Verify the password
          const isValid = await comparePasswords(password, user.password);
          if (!isValid) {
            return done(null, false, { message: "Invalid username or password" });
          }

          // Remove the password before passing the user
          const { password: _, ...userWithoutPassword } = user;

          // Update last login time
          await db.update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, user.id));

          return done(null, userWithoutPassword);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Configure Google OAuth strategy if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/auth/google/callback",
          scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if we already have this user
            const [existingAccount] = await db
              .select()
              .from(accounts)
              .where(
                and(
                  eq(accounts.provider, "google"),
                  eq(accounts.providerAccountId, profile.id)
                )
              );

            if (existingAccount) {
              // Get the user
              const user = await storage.getUser(existingAccount.userId);
              if (!user) {
                return done(new Error("User not found"));
              }

              // Update token info
              await db
                .update(accounts)
                .set({
                  accessToken,
                  refreshToken,
                  updatedAt: new Date(),
                })
                .where(eq(accounts.id, existingAccount.id));

              // Filter out password
              const { password: _, ...userWithoutPassword } = user;

              // Update last login time
              await db.update(users)
                .set({ lastLoginAt: new Date() })
                .where(eq(users.id, user.id));

              return done(null, userWithoutPassword);
            }

            // Create a new user
            const email = profile.emails && profile.emails[0]?.value;
            if (!email) {
              return done(new Error("Email not provided by Google"));
            }

            // Check if email is already registered
            const existingUser = await storage.getUserByEmail(email);
            if (existingUser) {
              // Link the Google account to the existing user
              await db.insert(accounts).values({
                userId: existingUser.id,
                provider: "google",
                providerAccountId: profile.id,
                accessToken,
                refreshToken,
                idToken: profile._json.id_token,
              });

              // Filter out password
              const { password: _, ...userWithoutPassword } = existingUser;

              // Update last login time
              await db.update(users)
                .set({ lastLoginAt: new Date() })
                .where(eq(users.id, existingUser.id));

              return done(null, userWithoutPassword);
            }

            // Create a new user and account
            const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
            const username = `google_${profile.id}`;

            const newUser = await storage.createUser({
              username,
              email,
              password: null, // Social login users don't have a password
              role: "user",
              fullName: name,
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              emailVerified: true, // Google emails are considered verified
              avatar: profile.photos?.[0]?.value || null,
              onboardingCompleted: false,
              onboardingStep: 1,
            });

            // Create the account link
            await db.insert(accounts).values({
              userId: newUser.id,
              provider: "google",
              providerAccountId: profile.id,
              accessToken,
              refreshToken,
              idToken: profile._json.id_token,
            });

            // Filter out password (should be null already)
            const { password: _, ...userWithoutPassword } = newUser;
            return done(null, userWithoutPassword);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Configure GitHub OAuth strategy if credentials are available
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: "/api/auth/github/callback",
          scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if we already have this user
            const [existingAccount] = await db
              .select()
              .from(accounts)
              .where(
                and(
                  eq(accounts.provider, "github"),
                  eq(accounts.providerAccountId, profile.id)
                )
              );

            if (existingAccount) {
              // Get the user
              const user = await storage.getUser(existingAccount.userId);
              if (!user) {
                return done(new Error("User not found"));
              }

              // Update token info
              await db
                .update(accounts)
                .set({
                  accessToken,
                  refreshToken,
                  updatedAt: new Date(),
                })
                .where(eq(accounts.id, existingAccount.id));

              // Filter out password
              const { password: _, ...userWithoutPassword } = user;

              // Update last login time
              await db.update(users)
                .set({ lastLoginAt: new Date() })
                .where(eq(users.id, user.id));

              return done(null, userWithoutPassword);
            }

            // Create a new user
            const email = profile.emails && profile.emails[0]?.value;
            if (!email) {
              return done(new Error("Email not provided by GitHub"));
            }

            // Check if email is already registered
            const existingUser = await storage.getUserByEmail(email);
            if (existingUser) {
              // Link the GitHub account to the existing user
              await db.insert(accounts).values({
                userId: existingUser.id,
                provider: "github",
                providerAccountId: profile.id.toString(),
                accessToken,
                refreshToken,
              });

              // Filter out password
              const { password: _, ...userWithoutPassword } = existingUser;

              // Update last login time
              await db.update(users)
                .set({ lastLoginAt: new Date() })
                .where(eq(users.id, existingUser.id));

              return done(null, userWithoutPassword);
            }

            // Create a new user and account
            const name = profile.displayName || profile.username || "";
            const username = `github_${profile.id}`;

            const newUser = await storage.createUser({
              username,
              email,
              password: null, // Social login users don't have a password
              role: "user",
              fullName: name,
              emailVerified: true, // GitHub emails are considered verified
              avatar: profile.photos?.[0]?.value || null,
              onboardingCompleted: false,
              onboardingStep: 1,
            });

            // Create the account link
            await db.insert(accounts).values({
              userId: newUser.id,
              provider: "github",
              providerAccountId: profile.id.toString(),
              accessToken,
              refreshToken,
            });

            // Filter out password (should be null already)
            const { password: _, ...userWithoutPassword } = newUser;
            return done(null, userWithoutPassword);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Configure session serialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      // Filter out password
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (err) {
      done(err);
    }
  });

  // API Routes
  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate input
      const { username, email, password, confirmPassword, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Check if the username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create the user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
        onboardingCompleted: false,
        onboardingStep: 1,
      });

      // Send verification email
      const origin = `${req.protocol}://${req.get('host')}`;
      await sendVerificationEmail(user, origin);

      // Login the user
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }

        // Return the user without password
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || "Authentication failed" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.status(200).json(req.user);
  });

  // Email verification endpoint
  app.get("/api/verify-email", async (req, res, next) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid token" });
      }

      // Find the user with this token
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.verificationToken, token));

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Update the user
      await db
        .update(users)
        .set({
          emailVerified: true,
          verificationToken: null,
        })
        .where(eq(users.id, user.id));

      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Forgot password endpoint
  app.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Always return success to avoid leaking whether an email exists
      const origin = `${req.protocol}://${req.get('host')}`;
      await sendPasswordResetEmail(email, origin);

      return res.status(200).json({ message: "If an account with that email exists, a password reset link has been sent" });
    } catch (error) {
      next(error);
    }
  });

  // Reset password endpoint
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, password, confirmPassword } = req.body;

      if (!token || !password || password !== confirmPassword) {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Find the user with this token
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.resetPasswordToken, token));

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Check if the token is expired
      if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: "Token has expired" });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update the user
      await db
        .update(users)
        .set({
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        })
        .where(eq(users.id, user.id));

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Update user profile endpoint
  app.patch("/api/user", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { 
        fullName, firstName, lastName, bio, avatar, 
        onboardingStep, onboardingCompleted, role, 
        preferences 
      } = req.body;

      // Only allow updating these fields
      const updatedUser = await storage.updateUser(userId, {
        fullName, 
        firstName, 
        lastName, 
        bio, 
        avatar,
        onboardingStep,
        onboardingCompleted,
        role: role && req.user.role === "admin" ? role : undefined, // Only admins can change roles
        preferences,
        updatedAt: new Date(),
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

  // Change password endpoint
  app.post("/api/change-password", isAuthenticated, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Get the user with password
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user || !user.password) {
        return res.status(400).json({ message: "User has no password (social login)" });
      }

      // Verify the current password
      const isValid = await comparePasswords(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the user
      await db
        .update(users)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Social login routes
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get(
      "/api/auth/google",
      passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
      "/api/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/auth" }),
      (req, res) => {
        // Redirect based on onboarding status
        if (req.user && !req.user.onboardingCompleted) {
          return res.redirect(`/onboarding?step=${req.user.onboardingStep || 1}`);
        }
        res.redirect("/");
      }
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    app.get(
      "/api/auth/github",
      passport.authenticate("github", { scope: ["user:email"] })
    );

    app.get(
      "/api/auth/github/callback",
      passport.authenticate("github", { failureRedirect: "/auth" }),
      (req, res) => {
        // Redirect based on onboarding status
        if (req.user && !req.user.onboardingCompleted) {
          return res.redirect(`/onboarding?step=${req.user.onboardingStep || 1}`);
        }
        res.redirect("/");
      }
    );
  }

  // Add demo user if it doesn't exist
  app.get("/api/create-demo-user", async (req, res) => {
    try {
      const demoUser = await storage.getUserByUsername("demo_user");
      if (!demoUser) {
        const hashedPassword = await hashPassword("Demo@123");
        const newUser = await storage.createUser({
          username: "demo_user",
          email: "demo@example.com",
          password: hashedPassword,
          role: "user",
          emailVerified: true,
          onboardingCompleted: true,
          onboardingStep: 5
        });
        return res.json({ message: "Demo user created" });
      }
      return res.json({ message: "Demo user already exists" });
    } catch (error) {
      console.error("Error creating demo user:", error);
      return res.status(500).json({ message: "Failed to create demo user" });
    }
  });
}