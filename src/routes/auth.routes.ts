import express from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ message: "Access granted" });
});

export default router;
