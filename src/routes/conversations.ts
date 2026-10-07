import { Router } from "express";
import {
	getConversations,
	getConversationById,
	updateConversation,
	deleteConversation,
	getMessages,
} from "../controllers/conversations.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

// GET /conversations  --> Get all conversations for the authenticated user
router.get("/", authMiddleware, asyncHandler(getConversations));

// GET /conversations/:id  --> Get a specific conversation by ID
router.get("/:id", authMiddleware, asyncHandler(getConversationById));

// PUT /conversations/:id  --> Update a specific conversation by ID
router.put("/:id", authMiddleware, asyncHandler(updateConversation));

// DELETE /conversations/:id  --> Delete a specific conversation by ID
router.delete("/:id", authMiddleware, asyncHandler(deleteConversation));

/*

	MESSAGING

*/
// GET /conversations/:id/messages  --> Get all messages for a specific conversation by ID
router.get("/:id/messages", authMiddleware, asyncHandler(getMessages));

export default router;
