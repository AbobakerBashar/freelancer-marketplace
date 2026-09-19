import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (
	schema: ZodType,
	target: "body" | "params" | "query",
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const result = schema.safeParse(req[target]);

		if (!result.success) {
			const formatedErrors: Record<string, string> = {};

			for (const issue of result.error.issues) {
				formatedErrors[issue.path.join(".")] = issue.message;
			}

			return res.status(400).json({
				message: "Validation failed",
				errors: formatedErrors,
			});
		}

		req[target] = result.data;

		next();
	};
};
