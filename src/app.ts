import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import projectsRoutes from "./routes/projects.js";
import proposalsRoutes from "./routes/proposals.js";
import conversationsRoutes from "./routes/conversations.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

// Middlewares

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	}),
);
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

// PROPOSALS ROUTES
app.use("/api/proposals", proposalsRoutes);

// CONVERSATIONS ROUTES
app.use("/api/conversations", conversationsRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Not found route handler
app.use((req, res) => {
	res.status(404).json({ message: "Route not found" });
});

export default app;
