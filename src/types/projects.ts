import type { Decimal } from "@prisma/client/runtime/client";

import {
	projectCreateSchema,
	projectQuerySchema,
	projectUpdateSchema,
} from "../schemas/projects.schema.js";
import type { z } from "zod";

type BudgetType = "FIXED" | "HOURLY";

type DurationUnit = "HOURS" | "DAYS" | "WEEKS" | "MONTHS";

type ProjectStatus =
	| "DRAFT"
	| "OPEN"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELLED"
	| "CLOSED";

export type ProjectSortField =
	| "createdAt"
	| "budgetMin"
	| "budgetMax"
	| "deadline";

export type Project = {
	id: string;

	description: string;
	title: string;

	category: string;
	skills: string[];

	budgetType: BudgetType;
	budgetMin: Decimal | null;
	budgetMax: Decimal | null;
	currency: string;

	duration: number | null;
	durationUnit: DurationUnit | null;

	status: ProjectStatus;

	deadline: Date | null;
	createdAt: Date;
	updatedAt: Date;
};

// export interface ProjectQuery {
// 	page?: number;
// 	limit?: number;

// 	search?: string;

// 	category?: string;
// 	status?: ProjectStatus;
// 	budgetType?: BudgetType;

// 	clientId?: string;

// 	minBudget?: number;
// 	maxBudget?: number;

// 	sort?: ProjectSortField;
// 	order?: "asc" | "desc";
// }

export type Pagination = {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	limit: number;
};

export type ProjectsResponse = {
	success: true;
	message?: string;
	projects: Project[];
	pagination: Pagination;
};

export type ProjectResponse = {
	success: boolean;
	message?: string;
	project?: Project;
};

export type ProjectQuery = z.infer<typeof projectQuerySchema>;

export type CreateProjectInput = z.infer<typeof projectCreateSchema>;

export type UpdateProjectInput = z.infer<typeof projectUpdateSchema>;
