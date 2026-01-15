import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { users } from "../db/mockDb";
import { env } from "../config/env";
import { generateId } from "../db/mockDb";
import { validationError, CustomError, asyncHandler } from "../middleware/errorHandler";

export const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

    // Validation
    if (!name || !email || !password) {
      throw validationError("Name, email and password are required", {
        missing: {
          name: !name,
          email: !email,
          password: !password
        }
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw validationError("Invalid email format");
    }

    // Password strength validation
    if (password.length < 8) {
      throw validationError("Password must be at least 8 characters long");
    }

    // Check for existing user
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new CustomError("Email already in use", 409, "EMAIL_EXISTS");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    // Generate token
    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, signOptions);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    // Validation
    if (!email || !password) {
      throw validationError("Email and password are required", {
        missing: {
          email: !email,
          password: !password
        }
      });
    }

    // Find user
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new CustomError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new CustomError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    // Generate token
    const signOptions: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as any };
    const token = jwt.sign({ userId: user.id, email: user.email }, env.JWT_SECRET, signOptions);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export const resetPasswordRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body as { email?: string };
    
    if (!email) {
      throw validationError("Email is required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw validationError("Invalid email format");
    }

    // Mock implementation – in real app, send email with token
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: "If that email exists, a password reset link has been sent"
    });
  } catch (error) {
    next(error);
  }
});

