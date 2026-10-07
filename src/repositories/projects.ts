import prisma from "../config/prisma.js";
import { ProposalStatus } from "../generated/prisma/enums.js";
import {
	CreateProjectInput,
	ProjectQuery,
	UpdateProjectInput,
} from "../types/projects.js";

export const getProjectsRepo = async (query: ProjectQuery) => {
	const skip =
		query.page && query.limit ? (query.page - 1) * query.limit : undefined;

	const whereClause: any = {};

	Object.entries(query).forEach(([key, value]) => {
		if (
			key !== "page" &&
			key !== "limit" &&
			key !== "sort" &&
			key !== "order" &&
			value !== undefined
		) {
			if (key === "search") {
				whereClause.OR = [
					{ title: { contains: value, mode: "insensitive" } },
					{ description: { contains: value, mode: "insensitive" } },
					{
						skills: {
							hasSome: [value],
						},
					},
				];
			} else {
				whereClause[key] = value;
			}
		}
	});

	const projects = await prisma.project.findMany({
		where: whereClause,

		orderBy: {
			[query.sort!]: query.order,
		},

		skip,
		take: query.limit,

		omit: {
			clientId: true,
		},
	});

	const totalCount = await prisma.project.count({
		where: whereClause,
	});

	return { projects, totalCount };
};

export const getActiveProjectsRepo = async (userId: string, role: string) => {
	const projects = await prisma.project.findMany({
		where: {
			status: "IN_PROGRESS",
			OR: [{ freelancerId: userId }, { clientId: userId }],
		},
		orderBy: {
			createdAt: "desc",
		},

		include: {
			client: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			freelancer: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	return projects;
};

export const getProjectsStatsicsRepo = async (clientId: string) => {
	const totalProjects = await prisma.project.count({
		where: {
			clientId,
		},
	});

	const status = await prisma.project.groupBy({
		where: {
			clientId,
		},
		by: ["status"],
		_count: {
			id: true,
		},
	});

	return {
		totalProjects,
		status,
	};
};

export const getProjectByIdRepo = async (id: string) => {
	return await prisma.project.findUnique({
		where: { id },
		omit: {
			clientId: true,
		},
	});
};

export const getPopularCategoriesRepo = async () => {
	const categories = await prisma.project.groupBy({
		by: ["category"],
		_count: {
			id: true,
		},
		orderBy: {
			_count: {
				id: "desc",
			},
		},
		take: 5,
	});
	return categories;
};

export const createProjectRepo = async (
	id: string,
	projectData: CreateProjectInput,
) => {
	return await prisma.project.create({
		data: {
			...projectData,
			clientId: id,
		},
	});
};

export const existsProjectWithId = async (
	clientId: string,
	id: string,
): Promise<UpdateProjectInput | null> => {
	const project = await prisma.project.findUnique({
		where: { id, clientId },
		select: {
			status: true,
			budgetMin: true,
			budgetMax: true,
			duration: true,
			durationUnit: true,
		},
	});

	return project
		? {
				budgetMin: Number(project.budgetMin),
				budgetMax: Number(project.budgetMax),
				duration: project.duration || undefined,
				durationUnit: project.durationUnit || undefined,
			}
		: null;
};

export const updateProjectRepo = async (
	userId: string,
	id: string,
	projectData: UpdateProjectInput,
) => {
	return await prisma.project.update({
		where: { id, clientId: userId },
		data: projectData,
	});
};

export const getProjectStatusRepo = async (projectId: string) => {
	return await prisma.project.findUnique({
		where: { id: projectId },
		select: {
			status: true,
		},
	});
};

export const deleteProjectRepo = async (userId: string, id: string) => {
	return await prisma.project.delete({
		where: { id, clientId: userId },
		select: {
			title: true,
		},
	});
};

export const getProjectWorkspaceRepo = async (
	projectId: string,
	userId: string,
) => {
	return await prisma.project.findUnique({
		where: {
			id: projectId,
			OR: [
				{ clientId: userId },
				{ proposals: { some: { freelancerId: userId } } },
			],
		},
		include: {
			conversations: {
				where: {},
				select: {
					id: true,
				},
				take: 1,
			},
			client: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
			freelancer: {
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
			},
			proposals: {
				where: { status: ProposalStatus.ACCEPTED },
			},
		},
	});
};

export const isConversationMemberRepo = async (
	userId: string,
	projectId: string,
) => {
	const conversation = await prisma.conversation.findFirst({
		where: {
			projectId,
			participants: {
				some: {
					participantId: userId,
				},
			},
		},
		select: {
			id: true,
		},
	});
	return !!conversation?.id;
};

export const getProjectConversationRepo = async (
	userId: string,
	projectId: string,
) => {
	const conversation = await prisma.conversation.findFirst({
		where: {
			projectId,
			participants: {
				some: {
					participantId: userId,
				},
			},
		},
		select: {
			id: true,
			messages: {
				orderBy: {
					createdAt: "desc",
				},
				take: 20,
				include: {
					sender: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
			},
		},
	});

	return conversation;
};
