import { z } from "zod";

export const projectQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),

	limit: z.coerce.number().int().min(1).max(100).default(10),

	search: z.string().trim().optional(),

	category: z.string().trim().optional(),

	status: z
		.preprocess(
			(value) => (typeof value === "string" ? value.toUpperCase() : value),
			z.enum(["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
		)
		.optional(),

	budgetType: z
		.preprocess(
			(value) => (typeof value === "string" ? value.toUpperCase() : value),
			z.enum(["FIXED", "HOURLY"]),
		)
		.optional(),

	clientId: z.uuid().optional(),

	minBudget: z.coerce.number().nonnegative().optional(),

	maxBudget: z.coerce.number().nonnegative().optional(),

	sort: z
		.enum(["createdAt", "budgetMin", "budgetMax", "deadline"])
		.default("createdAt"),

	order: z.enum(["asc", "desc"]).default("desc"),
});

export const projectCreateSchema = z.object({
	title: z
		.string("Invalid title. should be a string")
		.trim()
		.min(3, "Title must be at least 3 characters long")
		.max(100),

	description: z
		.string("Invalid description. should be a string")
		.trim()
		.min(10, "Description must be at least 10 characters long")
		.max(1000, "Description must be at most 1000 characters long"),

	category: z
		.string("Invalid category. should be a string")
		.trim()
		.min(3, "Category must be at least 3 characters long")
		.max(50, "Category must be at most 50 characters long"),

	skills: z
		.array(
			z
				.string("Invalid skill. should be a string")
				.trim()
				.min(2, "Skill must be at least 2 characters long")
				.max(50, "Skill must be at most 50 characters long"),
			"Skills must be an array of strings",
		)
		.min(1, "At least one skill is required")
		.max(20, "You can specify at most 20 skills"),

	budgetType: z.enum(
		["FIXED", "HOURLY"],
		"Budget type must be either 'FIXED' or 'HOURLY'",
	),

	budgetMin: z.coerce
		.number("Invalid budget min. should be a number")
		.nonnegative("Budget min must be a non-negative number")
		.optional(),

	budgetMax: z.coerce
		.number("Invalid budget max. should be a number")
		.nonnegative("Budget max must be a non-negative number")
		.optional(),

	currency: z
		.string("Invalid currency. should be a string")
		.trim()
		.toUpperCase()
		.length(3, "Currency must be exactly 3 characters long"),

	duration: z.coerce
		.number("Invalid duration. should be a number")
		.int()
		.positive("Duration must be a positive integer")
		.optional(),

	durationUnit: z
		.enum(
			["HOURS", "DAYS", "WEEKS", "MONTHS"],
			"Duration unit must be either 'HOURS', 'DAYS', 'WEEKS', or 'MONTHS'",
		)
		.optional(),

	status: z
		.preprocess(
			(value) => (typeof value === "string" ? value.toUpperCase() : value),
			z.enum(["OPEN", "DRAFT"], "Status must be either 'OPEN' or 'DRAFT'"),
		)
		.optional(),

	deadline: z.coerce.date("Invalid deadline. should be a valid date"),
});

export const projectUpdateSchema = projectCreateSchema.partial();
