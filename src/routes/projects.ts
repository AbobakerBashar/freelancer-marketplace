import { Router } from "express";
import {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	getProjectsStatsics,
} from "../controllers/projects.js";

import { asyncHandler } from "../utils/async-handler.js";

import { validate } from "../middleware/validate.js";

import {
	projectCreateSchema,
	projectQuerySchema,
	projectUpdateSchema,
} from "../schemas/projects.schema.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET /projects  --> Get all projects
router.get(
	"/",
	validate(projectQuerySchema, "query"),
	asyncHandler(getProjects),
);

// GET /projects/stats  --> Get projects statistics
router.get("/stats", asyncHandler(getProjectsStatsics));

// GET /projects/:id  --> Get project by ID
router.get("/:id", asyncHandler(getProjectById));

// POST /projects   --> Create a new project
router.post(
	"/",
	authMiddleware,
	validate(projectCreateSchema, "body"),
	asyncHandler(createProject),
);

// PUT /projects/:id   --> Update a project by ID
router.put(
	"/:id",
	authMiddleware,
	validate(projectUpdateSchema, "body"),
	asyncHandler(updateProject),
);

// DELETE /projects/:id   --> Delete a project by ID
router.delete("/:id", authMiddleware, asyncHandler(deleteProject));

export default router;
