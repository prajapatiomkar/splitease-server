import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IRequest } from "../interfaces/user.interface";

export interface AuthRequest extends Request {
  user?: { id: string }; // Extend Request type to include user
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    req.user = { id: decoded.id }; // Attach user ID to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
