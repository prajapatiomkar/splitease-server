import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import cors from "cors";

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: "http://localhost:5000", // Change this to your frontend URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Handle Preflight Requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export default app;
