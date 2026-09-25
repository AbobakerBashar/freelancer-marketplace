import { Router } from "express";
import {
	acceptProposal,
	createProposal,
	deleteProposal,
	getProposal,
	getProposalsByFreelancerId,
	rejectProposal,
	updateProposal,
} from "../controllers/proposals.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
	proposalCreateSchema,
	proposalUpdateSchema,
} from "../schemas/proposals.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

// Get all proposals for a specific freelancer
router.get("/my", authMiddleware, asyncHandler(getProposalsByFreelancerId));

// Get a specific proposal by its ID
router.get("/:id", authMiddleware, asyncHandler(getProposal));

// Create a new proposal
router.post(
	"/:id",
	authMiddleware,
	validate(proposalCreateSchema, "body"),
	asyncHandler(createProposal),
);

// Update an existing proposal
router.patch(
	"/:id",
	authMiddleware,
	validate(proposalUpdateSchema, "body"),
	asyncHandler(updateProposal),
);

// Delete a proposal
router.delete("/:id", authMiddleware, asyncHandler(deleteProposal));

// Accept a proposal
router.post("/:id/accept", authMiddleware, asyncHandler(acceptProposal));

// Reject a proposal
router.post("/:id/reject", authMiddleware, asyncHandler(rejectProposal));

export default router;
