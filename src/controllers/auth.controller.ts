import { Request, Response } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/user.validation";
import { registerUser } from "../services/auth.service";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { name, email, password } = req.body;
    const { user, token } = await registerUser(name, email, password);

    // Set JWT as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents access from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Expire the cookie immediately
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error: unknown) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
