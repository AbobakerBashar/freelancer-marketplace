import type { Socket } from "socket.io";
import { verifyAuthToken } from "../utils/auth.js";
import { AppError } from "../utils/AppError.js";

export const socketAuthMiddleware = (
	socket: Socket,
	next: (err?: Error) => void,
) => {
	try {
		const token = socket.handshake.headers.cookie
			?.split("; ")
			.find((cookie) => cookie.startsWith("jwt="))
			?.split("=")[1];

		if (!token) {
			return next(new AppError(401, "Unauthorized"));
		}

		const payload = verifyAuthToken(token);

		socket.data.user = {
			id: payload.id,
			role: payload.role,
		};

		next();
	} catch (error) {
		next(new AppError(401, "Unauthorized"));
	}
};
