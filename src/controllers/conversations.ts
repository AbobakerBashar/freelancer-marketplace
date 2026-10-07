import type { Request, Response } from "express";

import {
	getConversationsService,
	getConversationByIdService,
	updateConversationService,
	deleteConversationService,
	getMessagesService,
} from "../services/conversations.js";

import type {
	ConversationResponse,
	MessagesResponse,
} from "../types/conversations.js";

export const getConversations = async (req: Request, res: Response) => {
	const conversations = await getConversationsService();
};

export const getConversationById = async (
	req: Request<{ id: string }>,
	res: Response<ConversationResponse>,
) => {
	const userId = req.user?.id;

	const conversation = await getConversationByIdService(userId!, req.params.id);

	res.status(200).json({
		success: true,
		message: "Conversation retieve successfully!",
		conversation,
	});
};

export const updateConversation = async (
	req: Request<{ id: string }, any, any, any>,
	res: Response,
) => {
	const conversation = await updateConversationService(req.params.id, req.body);
};

export const deleteConversation = async (
	req: Request<{ id: string }>,
	res: Response,
) => {
	const conversation = await deleteConversationService(req.params.id);
};

/*

	MEssages

*/

export const getMessages = async (
	req: Request<{ id: string }>,
	res: Response<MessagesResponse>,
) => {
	const conversationId = req.params.id;
	const participantId = req.user?.id!;

	const messages = await getMessagesService(participantId, conversationId);

	res.status(200).json({
		data: messages,
		success: true,
		message: "Messages retieved successfully!",
	});
};

export const updateMsg = async (
	req: Request<{ id: string }>,
	res: Response,
) => {};

export const deleteMsq = async (req: Request, res: Response) => {};
