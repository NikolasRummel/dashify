import axiosInstance from "./axios";

/**
 * Performs a health check on the backend API.
 * Makes a GET request to the /api/test endpoint to verify API availability.
 * @returns A promise that resolves to the API response
 * @throws Will throw an error if the API is not available
 */
export const healthcheck = async () => {
	try {
		return await axiosInstance.get("/api/test");
	} catch (error) {
		throw error;
	}
};
