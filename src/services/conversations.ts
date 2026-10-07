import {
	delateConversationRepo,
	getConversationByIdRepo,
	getConversationsRepo,
	updateConversationRepo,
	getMessagesRepo,
	isMemberRepo,
	sendMessageRepo,
} from "../repositories/conversations.js";
import type { Conversation, Message } from "../types/conversations.js";
import { AppError } from "../utils/AppError.js";

export const getConversationsService = async () => {
	return await getConversationsRepo();
};

export const getConversationByIdService = async (
	userId: string,
	conversationId: string,
): Promise<Conversation> => {
	const { conversation, unreadCount } = await getConversationByIdRepo(
		userId,
		conversationId,
	);

	// Check dose conversation exists
	if (!conversation)
		throw new AppError(404, "Conversation not found or you are not authorized");

	const lastMessage = conversation.messages[0];
	const participants = conversation.participants.map((c) => c.participant);
	const project = conversation.project!;

	return {
		...conversation,
		project,
		lastMessage,
		participants,
		unreadCount,
	};
};

export const updateConversationService = async (
	conversationId: string,
	data: any,
) => {
	return await updateConversationRepo(conversationId, data);
};

export const deleteConversationService = async (conversationId: string) => {
	return await delateConversationRepo(conversationId);
};

/*

	MESSAGING

*/

export const getMessagesService = async (
	participantId: string,
	conversationId: string,
): Promise<Message[]> => {
	// Check Ownership
	const isMember = await isMemberRepo(participantId, conversationId);
	if (!isMember) throw new AppError(403, "Unauthorized!");

	const messages = await getMessagesRepo(conversationId);

	return messages;
};

export const sendMessageService = async (
	participantId: string,
	conversationId: string,
	message: string,
): Promise<Message> => {
	// Check Ownership
	const isMember = await isMemberRepo(participantId, conversationId);
	if (!isMember) throw new AppError(403, "Unauthorized!");

	const newMessage = await sendMessageRepo(
		participantId,
		conversationId,
		message,
	);

	return newMessage;
};
