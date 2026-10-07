import prisma from "../config/prisma.js";

export const getConversationsRepo = async () => {
	return await prisma.conversation.findMany();
};

export const getConversationByIdRepo = async (
	userId: string,
	conversationId: string,
) => {
	return await prisma.$transaction(async (tx) => {
		const conversation = await tx.conversation.findUnique({
			where: {
				id: conversationId,
				participants: {
					some: {
						participantId: userId,
					},
				},
			},
			include: {
				project: {
					select: {
						id: true,
						title: true,
					},
				},
				participants: {
					select: {
						participant: {
							select: {
								id: true,
								name: true,
								avatarUrl: true,
							},
						},
					},
				},
				messages: {
					orderBy: {
						createdAt: "desc",
					},
					take: 1,
					select: {
						id: true,
						content: true,
						createdAt: true,
						type: true,
						senderId: true,
					},
				},
			},
		});

		const unreadCount = await tx.message.count({
			where: {
				isRead: true,
			},
		});

		return { conversation, unreadCount };
	});
};

export const updateConversationRepo = async (
	conversationId: string,
	data: any,
) => {
	return await prisma.conversation.update({
		where: {
			id: conversationId,
		},
		data,
	});
};

export const delateConversationRepo = async (conversationId: string) => {
	return await prisma.conversation.delete({
		where: {
			id: conversationId,
		},
	});
};

/*

	MESSGIN

*/

export const isMemberRepo = async (
	participantId: string,
	conversationId: string,
) => {
	const conversationParticipant =
		await prisma.conversationParticipant.findUnique({
			where: {
				conversationId_participantId: { participantId, conversationId },
			},
			select: { id: true },
		});

	return !!conversationParticipant?.id;
};

export const getMessagesRepo = async (conversationId: string) => {
	return await prisma.message.findMany({
		where: {
			conversationId,
		},
		take: 20,
		include: {
			sender: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
	});
};

export const sendMessageRepo = async (
	participantId: string,
	conversationId: string,
	message: string,
) => {
	return await prisma.message.create({
		data: {
			content: message,
			senderId: participantId,
			type: "TEXT",
			conversationId,
		},
		include: {
			sender: {
				select: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
	});
};
