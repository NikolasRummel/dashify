"use server";

import { Session, User } from "@/types/auth";
import { cookies } from "next/headers";

/**
 * Server-side authentication function that verifies the user's session.
 * Checks for valid authentication token and user data in cookies.
 *
 * @returns A promise that resolves to the current session state
 *
 * The function:
 * 1. Retrieves authentication token and user data from cookies
 * 2. Decodes and validates the JWT token
 * 3. Parses and processes user data if available
 * 4. Returns the current authentication status and user information
 *
 * @example
 * const session = await auth();
 * if (session.status === 'authenticated') {
 *   // User is logged in
 *   console.log(session.user);
 * }
 */
export async function auth(): Promise<Session> {
	const cookieStore = await cookies();
	const token = cookieStore.get("dashify_token")?.value;
	const userCookie = cookieStore.get("dashify_user")?.value;

	// Removed unused variable 'decodedUser'

	let parsedUser: User | undefined;
	if (userCookie) {
		try {
			parsedUser = JSON.parse(
				Buffer.from(userCookie, "base64").toString("utf-8"),
			) as User;
			parsedUser.profilePicture =
				process.env.NEXT_PUBLIC_BACKEND_URL +
				"/" +
				parsedUser.profilePicture;
		} catch {
			parsedUser = undefined;
		}
	}

	let isValidToken: boolean = false;
	let payload;

	const tokenParts = token?.split(".") || [];
	if (tokenParts.length === 3) {
		try {
			const base64Payload = tokenParts[1];
			payload = JSON.parse(
				Buffer.from(base64Payload, "base64").toString("utf-8"),
			);

			if (payload.exp && payload.exp * 1000 > Date.now()) {
				isValidToken = true;
			}
		} catch (error) {
			console.warn("Failed to decode token payload:", error);
		}
	}

	return {
		status: isValidToken ? "authenticated" : "unauthenticated",
		user: parsedUser,
	};
}
