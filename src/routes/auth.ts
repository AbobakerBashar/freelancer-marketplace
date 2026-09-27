import { Router } from "express";
import {
	getMe,
	register,
	login,
	update,
	deleteUser,
} from "../controllers/auth.js";

import { validate } from "../middleware/validate.js";
import {
	registerSchema,
	loginSchema,
	updateSchema,
} from "../schemas/auth.schemas.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

const router = Router();

router.get("/me", authMiddleware, asyncHandler(getMe));

router.post(
	"/register",
	validate(registerSchema, "body"),
	asyncHandler(register),
);

router.post("/signin", validate(loginSchema, "body"), asyncHandler(login));

router.patch(
	"/update",
	authMiddleware,
	validate(updateSchema, "body"),
	asyncHandler(update),
);

router.delete("/delete", asyncHandler(deleteUser));

export default router;
