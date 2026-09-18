import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.js";

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

export default app;
