type User = {
	id: string;
	name: string;
	email: string;
	bio?: string | null;
	avatarUrl?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
};

export type AuthResponse = {
	success: boolean;
	message?: string;
	user?: User;
	errors?: Record<string, string>;
};

export type LoginInput = {
	email: string;
	password: string;
};

export type RegisterInput = {
	name: string;
	email: string;
	password: string;
	phone?: string;
	role?: "FREELANCER" | "CLIENT";
};

export type UpdateInput = {
	name?: string;
	phone?: string;
	role?: "FREELANCER" | "CLIENT";
	bio?: string;
	location?: string;
};
