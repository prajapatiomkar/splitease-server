import express, { Request, Response } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import User from "../models/user.model";

const router = express.Router();

interface IUser {
  id: string;
  name: string;
  email: string;
}

interface IRequest extends Request {
  user?: IUser;
}

// Example protected route
router.get(
  "/profile",
  authenticateUser,
  async (req: IRequest, res: Response): Promise<void> => {
    // ✅ Return type is `Promise<void>`
    try {
      console.log(req.user?.id, "req.user?.id");

      const user = await User.findById(req.user?.id).select("name email");

      if (!user) {
        res.status(404).json({ message: "User not found" }); // ✅ No `return` needed
        return;
      }

      res.json({ message: "Access granted", user }); // ✅ No `return` needed
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export default router;
