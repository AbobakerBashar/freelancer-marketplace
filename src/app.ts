import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (_, res) => {
	res.send("Freelance Marketplace API is running");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// PROJECTS ROUTES
app.use("/api/projects", projectsRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app;
