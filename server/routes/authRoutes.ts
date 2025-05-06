// server/routes/authRoutes.ts
import { userLoginSchema } from "../../shared/zodSchemas";
import { Request, Response } from "express";

// User login
app.post("/login", (req: Request, res: Response) => {
  const result = userLoginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors, // Return validation errors
    });
  }

  // Proceed with user login logic if validation passes
  const { email, password } = result.data;

  // Here you’d validate the email/password against the stored data
  // authService.loginUser(email, password);

  res.status(200).json({ message: "User logged in successfully!" });
});
