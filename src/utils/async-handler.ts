import type { Request, Response, NextFunction } from "express";

export const asyncHandler = (
	fn: (
		req: Request<{ id: string }>,
		res: Response,
		next: NextFunction,
	) => Promise<unknown>,
) => {
	return (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
		fn(req, res, next).catch(next);
	};
};
