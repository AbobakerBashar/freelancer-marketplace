import multer from "multer";

import path from "path";
import crypto from "crypto";
import { AppError } from "../utils/AppError.js";

export const storage = multer.diskStorage({
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);

		const uniqueName = `${file.fieldname}-${Date.now()}-${crypto.randomBytes(16).toString("hex")}-${ext}`;

		cb(null, uniqueName);
	},
});

export const upload = multer({
	storage: storage,
	// limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (req, file, cb) => {
		const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(new AppError(400, "Only JPEG, PNG, and GIF files are allowed"));
		}
		cb(null, true);
	},
});
