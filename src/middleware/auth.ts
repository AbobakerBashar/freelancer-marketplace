import type { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/auth.js";

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.jwt;
		if (!token) return res.status(401).json({ message: "Unauthorized" });

		// Verify the token and extract the user ID
		const { id } = verifyAuthToken(token);

		// Attach the user ID to the request object
		req.user = { id };

		next();
	} catch (error) {
		res.status(401).json({ message: "Unauthorized" });
	}
};
