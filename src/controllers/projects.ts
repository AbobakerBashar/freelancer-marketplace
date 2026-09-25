import type { Request, Response } from "express";
import type {
	CreateProjectInput,
	ProjectQuery,
	ProjectResponse,
	ProjectsResponse,
	UpdateProjectInput,
} from "../types/projects.ts";

import {
	getProjectsService,
	getProjectByIdService,
	createProjectService,
	updateProjectService,
	deleteProjectService,
	getProjectsStatsicsService,
	getPopularCategoriesService,
} from "../services/projects.js";

export const getProjects = async (
	req: Request,
	res: Response<ProjectsResponse>,
) => {
	const query = res.locals.query as ProjectQuery;

	const { projects, pagination } = await getProjectsService(query);

	res.status(200).json({
		success: true,
		projects,
		pagination,
	});
};

export const getProjectsStatsics = async (req: Request, res: Response) => {
	const stats = await getProjectsStatsicsService();

	res.status(200).json({
		success: true,
		stats,
	});
};

export const getProjectById = async (
	req: Request<{ id: string }>,
	res: Response<ProjectResponse>,
) => {
	const { id } = req.params;
	const project = await getProjectByIdService(id);

	res.status(200).json({
		success: true,
		project,
	});
};

export const getPopularCategories = async (req: Request, res: Response) => {
	const categories = await getPopularCategoriesService();
	res.status(200).json({
		success: true,
		categories,
	});
};

export const createProject = async (
	req: Request<{}, {}, CreateProjectInput>,
	res: Response<ProjectResponse>,
) => {
	const { id, role } = req.user ?? {};

	if (!id)
		return res.status(401).json({ success: false, message: "Unauthorized" });

	if (role !== "CLIENT")
		return res
			.status(403)
			.json({ success: false, message: "Only clients can create projects" });

	const project = await createProjectService(id, {
		...req.body,
	});

	res.status(201).json({
		success: true,
		project,
	});
};

export const updateProject = async (
	req: Request<{ id: string }, {}, UpdateProjectInput>,
	res: Response,
) => {
	const { id } = req.params;
	const { id: userId } = req.user ?? {};

	const project = await updateProjectService(userId!, id, req.body);
	res.status(200).json({
		success: true,
		message: "Project updated successfully",
		project,
	});
};

export const deleteProject = async (
	req: Request<{ id: string }>,
	res: Response<ProjectResponse>,
) => {
	const { id } = req.params;
	const { role, id: userId } = req.user ?? {};

	if (role !== "CLIENT")
		return res
			.status(403)
			.json({ success: false, message: "Only clients can delete projects" });

	const project = await deleteProjectService(userId!, id);
	res.status(200).json({
		success: true,
		message: `Project '${project.title}' deleted successfully`,
	});
};
