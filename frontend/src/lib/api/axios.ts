import axios, { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";

/**
 * The base URL for the backend API.
 * Retrieved from environment variables.
 */
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Configured axios instance for making API requests.
 * Includes:
 * - Base URL configuration
 * - Default headers
 * - Credentials handling
 */
const axiosInstance: AxiosInstance = axios.create({
	baseURL: backendUrl,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

/**
 * Response interceptor for handling API errors.
 * Provides user-friendly error messages using toast notifications.
 * Handles various HTTP status codes:
 * - 401: Authentication errors
 * - 403: Authorization errors
 * - 404: Resource not found
 * - 500: Server errors
 * Also handles network errors and request creation failures.
 */
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError) => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					toast.error("Authentifizierungsfehler", {
						description:
							error.message || "Bitte melde dich erneut an.",
					});
					break;
				case 403:
					toast.error("Zugriff verweigert", {
						description:
							error.message || "Du hast keine Berechtigung.",
					});
					break;
				case 404:
					toast.error("Ressource nicht gefunden", {
						description:
							error.message ||
							"Die angeforderte Ressource existiert nicht.",
					});
					break;
				case 500:
					toast.error("Serverfehler", {
						description:
							error.message || "Bitte versuche es später erneut.",
					});
					break;
				default:
					toast.error("Ein unerwarteter Fehler ist aufgetreten", {
						description:
							error.message || "Bitte versuche es später erneut.",
					});
					break;
			}
		} else if (error.request) {
			toast.error("Keine Antwort vom Server erhalten", {
				description:
					error.message ||
					"Bitte überprüfe deine Internetverbindung.",
			});
		} else {
			toast.error("Fehler beim Erstellen der Anfrage", {
				description:
					error.message || "Bitte versuche es später erneut.",
			});
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;
