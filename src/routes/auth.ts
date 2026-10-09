import { Router } from "express";
import {
	getMe,
	register,
	login,
	update,
	deleteUser,
	updateAvatar,
} from "../controllers/auth.js";

import { validate } from "../middleware/validate.js";
import {
	registerSchema,
	loginSchema,
	updateSchema,
} from "../schemas/auth.schemas.js";
import { authMiddleware } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

import { upload } from "../config/multer.js";
import { checkFileMiddleware } from "../middleware/checkFileMiddleware.js";

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

router.patch(
	"/update/avatar",
	authMiddleware,
	upload.single("avatar"),
	checkFileMiddleware,
	asyncHandler(updateAvatar),
);

router.delete("/delete", asyncHandler(deleteUser));

export default router;
