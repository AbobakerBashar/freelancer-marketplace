import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { initializeSockets } from "./sockets/index.socket.js";
import { socketAuthMiddleware } from "./middleware/socketAuth.js";
import connectToCloudinary from "./config/cludinary.js";

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	},
});

// Middleware to authenticate socket connections
io.use(socketAuthMiddleware);

// Initialize socket connections
initializeSockets(io);

// Connect to Cloudinary
connectToCloudinary();

httpServer.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
