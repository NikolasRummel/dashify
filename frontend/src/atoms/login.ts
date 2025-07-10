import { atom } from "jotai";

/**
 * Controls which tab is currently selected in the authentication form.
 * Can be 'login', 'register', or 'forgot-password'.
 * Defaults to 'login' when the form is first shown.
 */
export const authenticationFormSelectedTabAtom = atom<
	"login" | "register" | "forgot-password"
>("login");

/**
 * Controls the visibility of the authentication form.
 * Used to hide the form when authentication is successful
 * or when showing other content.
 */
export const authHideForm = atom<boolean>(false);
