import { Router } from "express";
import { register, login, update, deleteUser } from "../controllers/auth.js";

import { validate } from "../middleware/validate.js";
import {
	registerSchema,
	loginSchema,
	updateSchema,
} from "../schemas/auth.schemas.js";

const router = Router();

router.post("/register", validate(registerSchema, "body"), register);

router.post("/login", validate(loginSchema, "body"), login);

router.put("/update", validate(updateSchema, "body"), update);

router.delete("/delete", deleteUser);

export default router;
