import { isVerifiedAndIsActiveUser } from "../repositories/auth.js";
import {
	createProjectRepo,
	deleteProjectRepo,
	existsProjectWithId,
	getProjectByIdRepo,
	getProjectsRepo,
	getProjectsStatsicsRepo,
	updateProjectRepo,
	getPopularCategoriesRepo,
	getProjectStatusRepo,
	getActiveProjectsRepo,
	getProjectWorkspaceRepo,
	getProjectConversationRepo,
	isConversationMemberRepo,
} from "../repositories/projects.js";
import type {
	ActiveProject,
	CreateProjectInput,
	ProjectQuery,
	UpdateProjectInput,
} from "../types/projects.js";
import { AppError } from "../utils/AppError.js";

export const getProjectsService = async (query: ProjectQuery) => {
	const { projects, totalCount } = await getProjectsRepo(query);

	const totalPages = Math.ceil(totalCount / query.limit!);

	return {
		projects: projects.map((project) => ({
			...project,
			budgetMin: project.budgetMin ? Number(project.budgetMin) : null,
			budgetMax: project.budgetMax ? Number(project.budgetMax) : null,
		})),
		pagination: {
			currentPage: query.page!,
			limit: query.limit!,
			totalCount,
			totalPages,
		},
	};
};

export const getActiveProjectsService = async (
	userid: string,
	role: string,
): Promise<ActiveProject[]> => {
	const projects = await getActiveProjectsRepo(userid, role);

	const activeProjects = projects.map((project) => ({
		...project,
		budgetMin: project.budgetMin ? Number(project.budgetMin) : 0,
		budgetMax: project.budgetMax ? Number(project.budgetMax) : 0,
		freelancer: project.freelancer,
	}));
	return activeProjects;
};

export const getProjectsStatsicsService = async (clientId: string) => {
	const stats = await getProjectsStatsicsRepo(clientId);
	const formatedStats = stats.status.map((stat) => ({
		status: stat.status,
		count: stat._count.id,
	}));
	return {
		...stats,
		status: formatedStats,
	};
};

export const getProjectByIdService = async (id: string) => {
	const project = await getProjectByIdRepo(id);
	if (!project) {
		throw new AppError(404, "Project not found");
	}
	return {
		...project,
		budgetMin: project.budgetMin ? Number(project.budgetMin) : null,
		budgetMax: project.budgetMax ? Number(project.budgetMax) : null,
	};
};

export const getPopularCategoriesService = async () => {
	const categories = await getPopularCategoriesRepo();
	return categories.map((category) => ({
		category: category.category,
		count: category._count.id,
	}));
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
		const key = projectData.duration ? "durationUnit" : "duration";
		const errors: Record<string, string> = {
			[key]: "Duration and duration unit must be provided together",
		};

		throw new AppError(400, "Validation error", errors);
	}
	// Check if budgetMin is less than or equal to budgetMax
	if (
		projectData.budgetMin &&
		projectData.budgetMax &&
		projectData.budgetMin > projectData.budgetMax
	) {
		const errors: Record<string, string> = {
			budgetMin: "Budget min must be less than or equal to budget max",
		};

		throw new AppError(
			400,
			"Budget min must be less than or equal to budget max",
			errors,
		);
	}

	// Check if deadline is in the future
	if (projectData.deadline && projectData.deadline <= new Date()) {
		const errors: Record<string, string> = {
			deadline: "Deadline must be a future date",
		};
		throw new AppError(400, "Validation error", errors);
	}

	const project = await createProjectRepo(id, projectData);
	return {
		...project,
		budgetMin: project.budgetMin ? Number(project.budgetMin) : null,
		budgetMax: project.budgetMax ? Number(project.budgetMax) : null,
	};
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

	// Check if the project is allowed to be updated based on its status
	if (existingProject.status !== "DRAFT" && existingProject.status !== "OPEN") {
		throw new AppError(403, "Project is not allowed to be updated");
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
		const key = updateData.duration ? "durationUnit" : "duration";
		const errors: Record<string, string> = {
			[key]: "Duration and duration unit must be provided together",
		};

		throw new AppError(400, "Validation error", errors);
	}

	// Check if budgetMin is less than or equal to budgetMax
	if (
		updateData.budgetMin &&
		updateData.budgetMax &&
		updateData.budgetMin > updateData.budgetMax
	) {
		const errors: Record<string, string> = {
			budgetMin: "Budget min must be less than or equal to budget max",
		};

		throw new AppError(400, "Validation error", errors);
	}

	// Check if deadline is in the future
	if (updateData.deadline && updateData.deadline <= new Date()) {
		const errors: Record<string, string> = {
			deadline: "Deadline must be a future date",
		};
		throw new AppError(400, "Validation error", errors);
	}

	const project = await updateProjectRepo(userId, id, updateData);

	if (!project) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to update it",
		);
	}

	return {
		...project,
		budgetMin: project.budgetMin ? Number(project.budgetMin) : null,
		budgetMax: project.budgetMax ? Number(project.budgetMax) : null,
	};
};

export const deleteProjectService = async (
	userId: string,
	projectId: string,
) => {
	// Check if user is active and verified
	const isVerifiedAndActive = await isVerifiedAndIsActiveUser(userId);

	if (!isVerifiedAndActive) {
		throw new AppError(403, "User is not active or verified");
	}

	const project = await getProjectStatusRepo(projectId);

	// Check if is not exist throw an error
	if (!project) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to delete it",
		);
	}

	// Check is it allowed to delete
	if (project.status === "IN_PROGRESS" || project.status === "COMPLETED")
		throw new AppError(400, `Cannot delete project that is ${project.status}`);

	return await deleteProjectRepo(userId, projectId);
};

export const getProjectWorkspaceByIdService = async (
	projectId: string,
	userId: string,
) => {
	const project = await getProjectWorkspaceRepo(projectId, userId);

	if (!project) {
		throw new AppError(
			404,
			"Project not found or you do not have permission to view it",
		);
	}

	const hasProposals = project.proposals && project.proposals.length > 0;

	const proposal = hasProposals
		? {
				...project.proposals[0],
				bidAmount: Number(project.proposals[0].bidAmount),
			}
		: null;

	const workspace = {
		project: {
			...project,
			client: undefined,
			freelancer: undefined,
			proposals: undefined,
			conversations: undefined,

			budgetMin: project.budgetMin ? Number(project.budgetMin) : null,
			budgetMax: project.budgetMax ? Number(project.budgetMax) : null,
		},
		client: project.client,
		proposal,
		freelancer: project.freelancer || null,
		conversationId: project.conversations[0].id,
	};

	return workspace;
};

export const getProjectConversationService = async (
	userId: string,
	projectId: string,
) => {
	// Check Ownership
	const isMember = await isConversationMemberRepo(userId, projectId);
	if (!isMember) throw new AppError(403, "Unauthorized!");

	const conversation = await getProjectConversationRepo(userId, projectId);

	if (!conversation)
		throw new AppError(404, "Conversation not found for this project.");

	const messages = (conversation?.messages || []).map((ms) => ({
		...ms,
		sender: {
			id: ms.sender.id,
			name: ms.sender.name,
			avatarUrl: ms.sender.avatarUrl,
		},
	}));

	return {
		messages,
		conversationId: conversation.id,
	};
};
