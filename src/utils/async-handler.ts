import type { Request, Response, NextFunction } from "express";
import { uuid } from "zod";
import { AppError } from "./AppError.js";

export const asyncHandler = (
	fn: (
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<unknown>,
) => {
	return (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
		if (req.params.id && !uuid().validate(req.params.id)) {
			return next(new AppError(400, "Invalid ID format"));
		}

		fn(req, res, next).catch(next);
	};
};
