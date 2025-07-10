import { Login, RegisterDto } from "@/types/auth";
import axiosInstance from "./axios";

/**
 * Sends a login request to the server.
 *
 * @param credentials - The login credentials.
 * @returns A promise that resolves to the login response.
 * @throws An error if the request fails.
 */
export async function loginUser(credentials: Login) {
	try {
		return await axiosInstance.post("/api/auth/login", credentials);
	} catch (error) {
		throw error;
	}
}

/**
 * Sends a registration request to the server.
 *
 * @param credentials - The registration credentials.
 * @returns A promise that resolves to the registration response.
 * @throws An error if the request fails.
 */
export async function registerUser(credentials: RegisterDto) {
	try {
		return await axiosInstance.post("/api/auth/register", credentials);
	} catch (error) {
		throw error;
	}
}

/**
 * Sends a logout request to the server.
 *
 * @returns A promise that resolves to the logout response.
 * @throws An error if the request fails.
 */
export async function logoutUser() {
	try {
		return await axiosInstance.post("/api/auth/logout");
	} catch (error) {
		throw error;
	}
}

/**
 * Sends a request to delete the currently authenticated user.
 *
 * @returns A promise that resolves to the delete response.
 * @throws An error if the request fails.
 */
export async function deleteUser() {
	try {
		return await axiosInstance.delete("/api/users/delete");
	} catch (error) {
		throw error;
	}
}
