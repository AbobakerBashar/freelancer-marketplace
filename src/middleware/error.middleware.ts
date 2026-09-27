import { Prisma } from "../generated/prisma/client.js";

import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { ErrorResponse } from "../types/common.js";

export const errorMiddleware = (
	error: unknown,
	req: Request,
	res: Response<ErrorResponse>,
	next: NextFunction,
) => {
	const pathname = req.path;
	console.log(error);

	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		switch (error.code) {
			case "P2002": {
				if (pathname === "/api/auth/register") {
					return res.status(409).json({
						success: false,
						message: "Email already exists",
					});
				}

				return res.status(409).json({
					success: false,
					message: "Record already exists",
				});
			}

			case "P2003":
				return res.status(400).json({
					success: false,
					message: "Related record does not exist",
				});

			case "P2025":
				return res.status(404).json({
					success: false,
					message: "Record not found",
				});
		}
	}

	if (error instanceof AppError)
		return res
			.status(error.statusCode)
			.json({ success: false, message: error.message });

	return res.status(500).json({
		success: false,
		message: "Internal server error",
	});
};
