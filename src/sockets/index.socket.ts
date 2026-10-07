import { type Server } from "socket.io";
import {
	registerConversationSocket,
	registerMessageSocket,
} from "./conversation.socket.js";

export const initializeSockets = (io: Server) => {
	io.on("connection", (socket) => {
		console.log("Socket connected:");

		registerConversationSocket(socket);
		registerMessageSocket(io, socket);

		socket.on("disconnect", () => {
			console.log("Socket disconnected:");
		});
	});
};
