import { v2 as cloudinary } from "cloudinary";
import { AppError } from "./AppError.js";

export const uploadToCloudinary = async (filePath: string, folder: string) => {
	try {
		const uploadResult = await cloudinary.uploader.upload(filePath, { folder });
		return {
			url: uploadResult.secure_url,
			publicId: uploadResult.public_id,
		};
	} catch (error) {
		throw new AppError(500, "Failed to upload file");
	}
};

export const deleteFromCloudinary = async (publicId: string) => {
	try {
		return await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		throw new AppError(500, "Failed to delete file");
	}
};
