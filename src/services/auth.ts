import { Response } from "express";
import {
	getUserById,
	createUser,
	getUserByEmail,
	updateUser,
	updateUserAvatar,
	getAvatarPublicIdByUserId,
} from "../repositories/auth.js";
import type { LoginInput, RegisterInput, UpdateInput } from "../types/auth.js";
import { AppError } from "../utils/AppError.js";
import { getHashedPassword, isPasswordValid } from "../utils/auth.js";
import {
	uploadToCloudinary,
	deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const getMeService = async (userId: string) => {
	const user = await getUserById(userId);

	if (!user) throw new AppError(404, "User not found");

	return user;
};

export const registerService = async (res: Response, user: RegisterInput) => {
	// Hash the password before saving the user
	const hashedPassword = await getHashedPassword(user.password);

	const createdUser = await createUser({
		...user,
		password: hashedPassword,
	});

	if (!createdUser) throw new AppError(500, "Failed to create user");

	return createdUser;
};

export const loginService = async ({ email, password }: LoginInput) => {
	const user = await getUserByEmail(email);

	if (!user) throw new AppError(400, "Invalid email or password");

	const isPasswordMatch = await isPasswordValid(password, user.password);

	if (!isPasswordMatch) throw new AppError(400, "Invalid email or password");

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
};

export const updateService = async (
	userId: string,
	updates: Partial<UpdateInput>,
) => {
	return await updateUser(userId, {
		name: updates.name,
		phone: updates.phone,
		bio: updates.bio,
		location: updates.location,
		role: updates.role,
	});
};

export const updateAvatarService = async (userId: string, filePath: string) => {
	// Upload the avatar to Cloudinary
	const uploadResult = await uploadToCloudinary(filePath, "avatars");
	const avatarUrl = uploadResult.url;
	const avatarPublicId = uploadResult.publicId;

	try {
		const existingAvatarPublicId = await getAvatarPublicIdByUserId(userId);

		// Update the user's avatar in the database
		const updatedUser = await updateUserAvatar(userId, {
			avatarUrl,
			avatarPublicId,
		});

		// Delete the existing avatar from Cloudinary if it exists
		if (existingAvatarPublicId) {
			const destryResult = await deleteFromCloudinary(existingAvatarPublicId);
		}

		return updatedUser;
	} catch (error) {
		// If updating the user fails, delete the uploaded avatar from Cloudinary
		await deleteFromCloudinary(avatarPublicId);
		throw new AppError(500, "Failed to update user avatar");
	}
};
