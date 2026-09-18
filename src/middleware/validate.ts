import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (
	schema: ZodType,
	target: "body" | "params" | "query",
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[target]);
		console.log("Validation result:", result);
		if (!result.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: result.error.issues,
			});
		}

		req[target] = result.data;

		next();
	};
};
