import { z } from "zod";

/**
 * Schema for validating user registration form data.
 * Enforces:
 * - Username length between 3-20 characters
 * - Valid email format
 * - Password length between 8-100 characters
 * - Password confirmation matching
 */
export const RegisterSchema = z
	.object({
		username: z.string().min(3).max(20).trim(),
		email: z.string().email().trim(),
		password: z.string().min(8).max(100),
		confirmPassword: z.string().min(8).max(100),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match.",
		path: ["confirmPassword"],
	});

/**
 * Schema for validating user login form data.
 * Enforces:
 * - Valid email format
 * - Password length between 8-100 characters
 */
export const LoginSchema = z.object({
	email: z.string().email().trim(),
	password: z.string().min(8).max(100),
});

/**
 * Type for user registration data sent to the server.
 * Excludes the confirmPassword field as it's only used for validation.
 */
export type RegisterDto = Omit<
	z.infer<typeof RegisterSchema>,
	"confirmPassword"
>;

/**
 * Type for user login data sent to the server.
 * Contains email and password fields.
 */
export type Login = z.infer<typeof LoginSchema>;

/**
 * Represents a user in the system.
 * Contains all user-related data including authentication and preferences.
 */
export type User = {
	id: number;
	email: string;
	username: string;
	password: string;
	language: string;
	profilePicture: string;
	backgroundImage: string;
	accentColor: string;
};

/**
 * Represents the current authentication state.
 * Can be in one of three states:
 * - authenticated: User is logged in
 * - unauthenticated: User is logged out
 * - loading: Authentication state is being determined
 */
export type Session = {
	status: "authenticated" | "unauthenticated" | "loading";
	user?: User;
};

/**
 * Extends Session type with an update method.
 * Used for components that need to update user data.
 */
export type SessionWithUpdate = Session & {
	update: (data: UserUpdateRequest) => void;
};

/**
 * Type for user profile update requests.
 * All fields are optional to allow partial updates.
 * Null values for images indicate removal of the image.
 */
export type UserUpdateRequest = {
	language?: string;
	profilePicture?: string | null;
	backgroundImage?: string | null;
	accentColor?: string;
};
