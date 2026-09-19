import { z } from "zod";

export const registerSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),

	email: z.email("Invalid email"),

	password: z.string().min(8, "Password must be at least 8 characters"),

	phone: z
		.string()
		.trim()
		.regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
		.optional(),

	role: z
		.preprocess(
			(value) =>
				typeof value === "string" ? value.trim().toUpperCase() : value,
			z.enum(
				["FREELANCER", "CLIENT"],
				"Role must be either 'CLIENT' or 'FREELANCER'",
			),
		)
		.optional(),
});

export const loginSchema = z.object({
	email: z.email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters")
		.optional(),

	phone: z
		.string()
		.trim()
		.regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
		.optional(),

	role: z
		.preprocess(
			(value) =>
				typeof value === "string" ? value.trim().toUpperCase() : value,
			z.enum(
				["FREELANCER", "CLIENT"],
				"Role must be either 'CLIENT' or 'FREELANCER'",
			),
		)
		.optional(),

	bio: z
		.string()
		.trim()
		.min(10, "Bio must be at least 10 characters")
		.max(250, "Bio must be at most 250 characters")
		.optional(),

	location: z
		.string()
		.trim()
		.min(2, "Location must be at least 2 characters")
		.max(100, "Location must be at most 100 characters")
		.optional(),
});
