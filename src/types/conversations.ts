export interface Conversation {
	id: string;
	project: {
		id: string;
		title: string;
	};
	participants: ConversationUser[];
	lastMessage: MessagePreview | null;
	unreadCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ConversationParticipant {
	id: string;
	conversationId: string;
	userId: string;
	user: ConversationUser;
}

export interface ConversationUser {
	id: string;
	name: string;
	avatarUrl: string | null;
}

export interface ConversationListItem {
	id: string;
	project: {
		id: string;
		title: string;
	};
	otherUser: ConversationUser;
	lastMessage: MessagePreview | null;
	unreadCount: number;
	updatedAt: Date;
}

export interface MessagePreview {
	id: string;
	content: string | null;
	type: MessageType;
	senderId: string;
	createdAt: Date;
}

export interface Message {
	id: string;
	conversationId: string;
	sender: ConversationUser;
	content: string | null;
	type: MessageType;
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
}

type MessageType = "TEXT" | "IMAGE" | "FILE";

// API respose

export interface ConversationResponse {
	success: boolean;
	message?: string;
	conversation: Conversation;
}

export interface MessagesResponse {
	success: boolean;
	message: string;
	data: Message[];
}

export interface MessageResponse {
	success: boolean;
	message: string;
	data: Message;
}

export interface ProjectConversationResponse {
	data?: {
		messages: Omit<Message, "conversationId">[];
		conversationId: string;
	};
	success: boolean;
	message?: string;
}
