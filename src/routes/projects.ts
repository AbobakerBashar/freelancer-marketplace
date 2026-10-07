import { Router } from "express";
import {
	getProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
	getProjectsStatsics,
	getPopularCategories,
	getActiveProjects,
	getProjectWorkspaceById,
	getProjectConversation,
} from "../controllers/projects.js";

import { asyncHandler } from "../utils/async-handler.js";

import { validate } from "../middleware/validate.js";

import {
	projectCreateSchema,
	projectQuerySchema,
	projectUpdateSchema,
} from "../schemas/projects.schema.js";
import { authMiddleware } from "../middleware/auth.js";
import {
	getProjectsProposalsCount,
	getProposalsByProjectId,
} from "../controllers/proposals.js";

const router = Router();

// GET /projects  --> Get all projects
router.get(
	"/",
	validate(projectQuerySchema, "query"),
	asyncHandler(getProjects),
);

// GET /projects/active  --> Get all active projects for the authenticated user
router.get("/active", authMiddleware, asyncHandler(getActiveProjects));

// GET /projects/stats  --> Get projects statistics
router.get("/stats", asyncHandler(getProjectsStatsics));

// GET /projects/:id/conversation
router.get(
	"/:id/conversation",
	authMiddleware,
	asyncHandler(getProjectConversation),
);

// GET /projects/popular-categories  --> Get popular project categories
router.get("/popular-categories", asyncHandler(getPopularCategories));

// Get projects proposals count
router.get("/proposals-count", asyncHandler(getProjectsProposalsCount));

/*
/Get all proposals for a specific project
*/
router.get("/:id/proposals", asyncHandler(getProposalsByProjectId));

// GET /projects/:id  --> Get project by ID
router.get("/:id", asyncHandler(getProjectById));

// GET /projects/:id/workspace  --> Get workspace for a specific project
router.get(
	"/:id/workspace",
	authMiddleware,
	asyncHandler(getProjectWorkspaceById),
);

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
