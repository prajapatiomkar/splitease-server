import express, { Request, Response } from "express";
import { authenticateUser } from "../middleware/auth.middleware";
import User from "../models/user.model";
import { createGroup, getUserGroups } from "../controllers/user.controller";
import { IRequest } from "../interfaces/user.interface";

const router = express.Router();

// Example protected route
router.get(
  "/profile",
  authenticateUser,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const typedReq = req as unknown as IRequest;
      console.log(typedReq?.user?.id as string, "req.user?.id");

      const user = await User.findById(typedReq?.user?.id as string).select(
        "name email"
      );

      if (!user) {
        res.status(404).json({ message: "User not found" }); // ✅ No `return` needed
        return;
      }

      res.json({ message: "Access granted", user });
      return;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  }
);

router.post("/create-group", authenticateUser, createGroup);
router.get("/get-group", authenticateUser, getUserGroups);
export default router;
