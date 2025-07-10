import axiosInstance from "./axios";

export type UserSharingSummary = {
	id: number;
	email: string;
	username: string;
	sharing: boolean;
};

export async function suggestUsersForSharing(
	query: string,
	dashboardId: number,
): Promise<UserSharingSummary[]> {
	try {
		const response = await axiosInstance.get(
			"/api/dashboards/share/suggestions",
			{
				params: { query, dashboardId },
			},
		);

		return response.data;
	} catch (error) {
		throw error;
	}
}
