import type { Request, Response, NextFunction } from "express";

export const checkFileMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (!req.file)
		res.status(400).json({ success: false, message: "No file uploaded" });
	next();
};
