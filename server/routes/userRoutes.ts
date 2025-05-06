// server/routes/userRoutes.ts
import { userCreateSchema } from "../../shared/zodSchemas";
import { Request, Response } from "express";

// Register a new user
app.post("/register", (req: Request, res: Response) => {
  const result = userCreateSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      errors: result.error.errors, // Return validation errors
    });
  }

  // Proceed with user creation logic if validation passes
  const { username, email, password } = result.data;

  // Here you'd typically hash the password and save the user to the database
  // userService.createUser(username, email, password);

  res.status(201).json({ message: "User registered successfully!" });
});
