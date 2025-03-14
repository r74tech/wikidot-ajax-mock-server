import { store } from "../../data";
// src/controllers/actions/login.ts
import type { ActionResponse } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function login(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { name, password, keepLogged, bindIP } = params;

	// Find the user by name or email
	const user = store.getUserByName(String(name || "")) || store.getUserByEmail(String(name || ""));

	if (!user || user.password !== String(password || "")) {
		throw new WikidotError("Invalid login credentials", "login_invalid");
	}

	// Create a session
	const session = store.createSession(user.id);

	return createActionResponse({
		userId: user.id,
		userName: user.name,
		userScreenName: user.screenName,
		sessionId: session.token,
		message: "Login successful",
	});
}

export async function logout(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { href } = params;

	// In a real implementation, we would invalidate the session
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Logout successful",
		redirectUrl: href || "/",
	});
}

export async function loginCancel(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	// In a real implementation, we would clean up any temporary login state
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Login cancelled",
	});
}
