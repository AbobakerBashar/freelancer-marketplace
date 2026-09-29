export type ErrorResponse = {
	message: string;
	success: boolean;
	errors?: Record<string, string>;
};
