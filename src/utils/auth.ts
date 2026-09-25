import "dotenv/config";

import bcrypt from "bcrypt";

import type { Response } from "express";

import jwt from "jsonwebtoken";
import { AppError } from "./AppError.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new AppError(
		500,
		"JWT_SECRET is not defined in the environment variables",
	);
}

// Generates a JWT token and sets it as a cookie in the response
export const generateToken = (res: Response, id: string, role: string) => {
	const token = jwt.sign({ id, role }, JWT_SECRET as string, {
		expiresIn: "3d",
	});

	return token;
};

// Verifies a JWT token and returns the decoded payload
export const verifyAuthToken = (
	token: string,
): { id: string; role: string } => {
	return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
};

// Hashes a password using bcrypt
export const getHashedPassword = async (password: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
};

// Compares a plain text password with a hashed password
export const isPasswordValid = async (
	password: string,
	hashedPassword: string,
): Promise<boolean> => {
	return await bcrypt.compare(password, hashedPassword);
};
