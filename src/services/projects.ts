import { isVerifiedAndIsActiveUser } from "../repositories/auth.js";
import {
	createProjectRepo,
	deleteProjectRepo,
	existsProjectWithId,
	getProjectByIdRepo,
	getProjectsRepo,
	getProjectsStatsicsRepo,
	updateProjectRepo,
} from "../repositories/projects.js";
import type {
	CreateProjectInput,
	ProjectQuery,
	UpdateProjectInput,
} from "../types/projects.js";
import { AppError } from "../utils/AppError.js";

export const getProjectsService = async (query: ProjectQuery) => {
	const { projects, totalCount } = await getProjectsRepo(query);

	const totalPages = Math.ceil(totalCount / query.limit!);

	return {
		projects,
		pagination: {
			currentPage: query.page!,
			limit: query.limit!,
			totalCount,
			totalPages,
		},
	};
};

export const getProjectsStatsicsService = async () => {
	return await getProjectsStatsicsRepo();
};

export const getProjectByIdService = async (id: string) => {
	const project = await getProjectByIdRepo(id);
	if (!project) {
		throw new AppError(404, "Project not found");
	}
	return project;
};

export const createProjectService = async (
	id: string,
	projectData: CreateProjectInput,
) => {
	// Check if user is active and verified
	const isVerifiedAndActive = await isVerifiedAndIsActiveUser(id);

	if (!isVerifiedAndActive) {
		throw new AppError(403, "User is not active or verified");
	}

	// Check if duration and durationUnit are provided together
	if (
		(projectData.duration && !projectData.durationUnit) ||
		(!projectData.duration && projectData.durationUnit)
	) {
		throw new AppError(
			400,
			"Duration and duration unit must be provided together",
		);
	}

	// Check if budgetMin is less than or equal to budgetMax
	if (
		projectData.budgetMin &&
		projectData.budgetMax &&
		projectData.budgetMin > projectData.budgetMax
	) {
		throw new AppError(
			400,
			"Budget min must be less than or equal to budget max",
		);
	}

	// Check if deadline is in the future
	if (projectData.deadline && projectData.deadline <= new Date()) {
		throw new AppError(400, "Deadline must be a future date");
	}

	return await createProjectRepo(id, projectData);
};

export const updateProjectService = async (
	userId: string,
	id: string,
	projectData: UpdateProjectInput,
) => {
	// Check if user is active and verified
	const isVerifiedAndActive = await isVerifiedAndIsActiveUser(userId);

	if (!isVerifiedAndActive) {
		throw new AppError(403, "User is not active or verified");
	}

	const existingProject = await existsProjectWithId(userId, id);
	if (!existingProject) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to update it",
		);
	}

	const updateData: UpdateProjectInput = {
		...existingProject,
		...projectData,
	};

	// Check if duration and durationUnit are provided together
	if (
		(updateData.duration && !updateData.durationUnit) ||
		(!updateData.duration && updateData.durationUnit)
	) {
		throw new AppError(
			400,
			"Duration and duration unit must be provided together",
		);
	}

	// Check if budgetMin is less than or equal to budgetMax
	if (
		updateData.budgetMin &&
		updateData.budgetMax &&
		updateData.budgetMin > updateData.budgetMax
	) {
		throw new AppError(
			400,
			"Budget min must be less than or equal to budget max",
		);
	}

	// Check if deadline is in the future
	if (updateData.deadline && updateData.deadline <= new Date()) {
		throw new AppError(400, "Deadline must be a future date");
	}

	const project = await updateProjectRepo(userId, id, updateData);

	if (!project) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to update it",
		);
	}

	return project;
};

export const deleteProjectService = async (userId: string, id: string) => {
	// Check if user is active and verified
	const isVerifiedAndActive = await isVerifiedAndIsActiveUser(userId);

	if (!isVerifiedAndActive) {
		throw new AppError(403, "User is not active or verified");
	}

	const project = await deleteProjectRepo(userId, id);

	if (!project) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to delete it",
		);
	}
	return project;
};
