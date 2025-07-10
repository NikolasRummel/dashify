import { AuthContext } from "@/components/wrappers/auth/auth-context-provider";
import axiosInstance from "@/lib/api/axios";
import { SessionWithUpdate, UserUpdateRequest } from "@/types/auth";
import { useContext, useEffect } from "react";
import { auth } from "./auth";

/**
 * Updates the user's profile data on the server.
 * @param data - The user data to update
 * @returns A promise that resolves when the update is complete
 * @throws Will throw an error if the request fails
 */
export const updateUser = async (data: UserUpdateRequest) => {
	console.log("Updating user data", data);
	try {
		return await axiosInstance.post("/api/users/update", data);
	} catch (error) {
		throw error;
	}
};

/**
 * Hook for accessing and managing the user's session.
 * Provides access to the current session state and methods to update it.
 * Automatically refreshes the session when it's in a loading state.
 *
 * @returns The current session with an update method
 * @throws Error if used outside of an AuthContextProvider
 *
 * @example
 * const { status, user, update } = useSession();
 * // Update user profile
 * update({ language: 'en' });
 */
export function useSession(): SessionWithUpdate {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error(
			"useSession must be used within an AuthContextProvider",
		);
	}

	const { session, setSession } = context;

	useEffect(() => {
		if (session.status !== "loading") return;
		auth().then((newSession) => {
			setSession(newSession);
		});
	}, [session]);

	return {
		...session,
		update: (data) => {
			updateUser(data).then(() => {
				auth().then((newSession) => {
					console.log("New session data", newSession);
					setSession(newSession);
				});
			});
		},
	};
}
