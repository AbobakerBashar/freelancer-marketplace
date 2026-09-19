import type { Request, Response } from "express";
import {
	getMeService,
	registerService,
	loginService,
	updateService,
} from "../services/auth.js";
import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth.js";
import { generateAndSetAuthCookie } from "../utils/auth.js";

export const getMe = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId)
		return res.status(401).json({ success: false, message: "Unauthorized" });

	const user = await getMeService(userId);

	res.status(200).json({ success: true, user });
};

export const register = async (
	req: Request<{}, {}, RegisterInput>,
	res: Response<AuthResponse>,
) => {
	const user = await registerService(res, req.body);

	// Set cookie with the user ID
	generateAndSetAuthCookie(res, user.id);

	res
		.status(201)
		.json({ success: true, message: "User registered successfully", user });
};

export const login = async (
	req: Request<{}, {}, LoginInput>,
	res: Response<AuthResponse>,
) => {
	const user = await loginService(req.body);

	// Set cookie with the user ID
	generateAndSetAuthCookie(res, user.id);

	res.json({ success: true, message: "User logged in successfully", user });
};

export const update = async (req: Request, res: Response<AuthResponse>) => {
	const userId = req.user?.id;
	if (!userId)
		return res.status(401).json({ success: false, message: "Unauthorized" });

	const updates = req.body;
	const updatedUser = await updateService(userId, updates);

	res.json({
		success: true,
		message: "User updated successfully",
		user: updatedUser,
	});
};

export const deleteUser = async (
	req: Request,
	res: Response<AuthResponse>,
) => {};
