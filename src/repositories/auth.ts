import prisma from "../config/prisma.js";
import type { RegisterInput, UpdateInput } from "../types/auth.js";

export const getUserById = async (id: string) => {
	return await prisma.user.findUnique({
		where: {
			id,
		},
		omit: {
			password: true,
		},
	});
};

export const isVerifiedAndIsActiveUser = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			isVerified: true,
			isActive: true,
		},
	});
	return (user?.isVerified && user?.isActive) || false;
};

export const createUser = async (userData: RegisterInput) => {
	return await prisma.user.create({
		data: userData,
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	});
};

export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: true,
			role: true,
		},
	});
};

export const updateUser = async (
	userId: string,
	updates: Partial<UpdateInput>,
) => {
	return await prisma.user.update({
		where: { id: userId },
		data: updates,
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			bio: true,
			avatarUrl: true,
			createdAt: true,
			updatedAt: true,
		},
	});
};
