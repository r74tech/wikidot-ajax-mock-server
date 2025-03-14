// src/controllers/actions/account.ts
import type { ActionResponse } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function uploadAvatar(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	// In a real implementation, we would handle file upload
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Avatar uploaded successfully",
		tempFiles: {
			im48: "temp_avatar_48.jpg",
			im16: "temp_avatar_16.jpg",
		},
	});
}

export async function setAvatar(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { im48, im16 } = params;

	// In a real implementation, we would save the avatar files
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Avatar set successfully",
	});
}

export async function deleteAvatar(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	// In a real implementation, we would delete the avatar files
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Avatar deleted successfully",
	});
}

export async function saveAbout(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const {
		real_name,
		gender,
		birthday_day,
		birthday_month,
		birthday_year,
		about,
		website,
		location,
	} = params;

	// In a real implementation, we would update the user profile
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Profile updated successfully",
	});
}

export async function changeScreenName(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { screenName } = params;

	if (!screenName || String(screenName).length < 2 || String(screenName).length > 20) {
		throw new WikidotError(
			"Screen name must be between 2 and 20 characters",
			"form_errors",
		);
	}

	// In a real implementation, we would update the user's screen name
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Screen name updated successfully",
	});
}
