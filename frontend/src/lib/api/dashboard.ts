import { User } from "@/types/auth";
import { Dashboard, WidgetType } from "@/types/dashboard";
import axiosInstance from "./axios";

/**
 * Type for creating a new dashboard.
 * Omits id, userId, and widgets as they are managed by the server.
 */
type CreateDashboardDto = Omit<Dashboard, "id" | "userId" | "widgets">;

/**
 * Creates a new dashboard with the specified name.
 * @param name - The name of the dashboard
 * @returns A promise that resolves to the created dashboard
 * @throws Will throw an error if the request fails
 */
export async function createDashboard(name: string) {
	const payload: CreateDashboardDto = {
		name,
		height: 3,
		width: 6,
	};

	try {
		return await axiosInstance.post("/api/dashboards/create", payload);
	} catch (error) {
		throw error;
	}
}

/**
 * Updates an existing dashboard's properties.
 * @param id - The ID of the dashboard to update
 * @param dashboard - Partial dashboard data to update
 * @returns A promise that resolves to the updated dashboard
 * @throws Will throw an error if the request fails
 */
export async function updateDashboard(
	id: Dashboard["id"],
	dashboard: Partial<CreateDashboardDto>,
) {
	try {
		console.log("updateDashboard", id, dashboard);
		return await axiosInstance.put(
			`/api/dashboards/update/${id}`,
			dashboard,
		);
	} catch (error) {
		throw error;
	}
}

/**
 * Deletes a dashboard by its ID.
 * @param id - The ID of the dashboard to delete
 * @returns A promise that resolves when the dashboard is deleted
 * @throws Will throw an error if the request fails
 */
export async function deleteDashboard(id: Dashboard["id"]) {
	try {
		return await axiosInstance.delete(`/api/dashboards/delete/${id}`);
	} catch (error) {
		throw error;
	}
}

/**
 * Saves the widget configuration for a dashboard.
 * @param id - The ID of the dashboard
 * @param widgets - Array of widget configurations to save
 * @returns A promise that resolves when the widgets are saved
 * @throws Will throw an error if the request fails
 */
export async function saveDashboard(
	id: Dashboard["id"],
	widgets: WidgetType[],
) {
	try {
		return await axiosInstance.post(
			`/api/dashboards/${id}/widgets`,
			widgets,
		);
	} catch (error) {
		throw error;
	}
}

export async function shareDashboard(
	dashboardId: Dashboard["id"],
	userId: User["id"],
) {
	try {
		return await axiosInstance.post(
			`/api/dashboards/${dashboardId}/share/${userId}`,
		);
	} catch (error) {
		throw error;
	}
}
