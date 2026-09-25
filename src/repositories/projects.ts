import prisma from "../config/prisma.js";
import {
	CreateProjectInput,
	ProjectQuery,
	UpdateProjectInput,
} from "../types/projects.js";
import { AppError } from "../utils/AppError.js";

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

export const getProjectsStatsicsRepo = async () => {
	const totalProjects = await prisma.project.count();

	const status = await prisma.project.groupBy({
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

export const deleteProjectRepo = async (userId: string, id: string) => {
	return await prisma.project.delete({
		where: { id, clientId: userId },
		select: {
			title: true,
		},
	});
};
