import express, { Request, Response } from "express";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

interface IRequest extends Request {
  user?: { id: string }; // Match the middleware type
}

// Example protected route
router.get("/profile", authenticateUser, (req: IRequest, res: Response) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
