import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),

	email: z.email("Invalid email"),

	password: z.string().min(8, "Password must be at least 8 characters"),

	phone: z.string().optional(),

	role: z
		.enum(
			["FREELANCER", "CLIENT"],
			"Role must be either 'CLIENT' or 'FREELANCER'",
		)
		.optional(),
});

export const loginSchema = z.object({
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
	email: z.string().email("Invalid email").optional(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.optional(),
	phone: z.string().optional(),
	role: z
		.enum(
			["FREELANCER", "CLIENT"],
			"Role must be either 'CLIENT' or 'FREELANCER'",
		)
		.optional(),
});
