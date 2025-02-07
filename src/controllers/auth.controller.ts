import { Request, Response } from "express";
import { registerValidation } from "../validations/user.validation";
import { registerUser } from "../services/auth.service";

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
