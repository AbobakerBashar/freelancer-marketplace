import type { Server, Socket } from "socket.io";
import { sendMessageService } from "../services/conversations.js";
import { isMemberRepo } from "../repositories/conversations.js";

import { uuid } from "zod";

export const registerConversationSocket = (socket: Socket) => {
	socket.on("conversation:join", async ({ conversationId }, callback) => {
		try {
			// Validate the conversation ID
			if (uuid().validate(conversationId) === false) {
				callback({
					success: false,
					message: "Invalid conversation ID",
				});
				return;
			}

			// Check if the user is a member of the conversation
			const isMember = await isMemberRepo(socket.data.user.id, conversationId);
			if (!isMember) {
				callback({
					success: false,
					message: "Unauthorized",
				});
				return;
			}

			socket.join(`conversation:${conversationId}`);

			callback({
				success: true,
			});
		} catch {
			callback({
				success: false,
				message: "Unauthorized",
			});
		}
	});
};

export const registerMessageSocket = (io: Server, socket: Socket) => {
	socket.on("message:send", async ({ conversationId, content }, callback) => {
		// Validate the conversation ID
		if (uuid().validate(conversationId) === false) {
			callback({
				success: false,
				message: "Invalid conversation ID",
			});
			return;
		}

		try {
			const message = await sendMessageService(
				socket.data.user.id,
				conversationId,
				content,
			);

			io.to(`conversation:${conversationId}`).emit("message:new", message);

			callback({
				success: true,
				data: message,
			});
		} catch (error) {
			callback({
				success: false,
				message: "Failed to send message",
			});
		}
	});
};
