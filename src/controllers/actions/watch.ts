// src/controllers/actions/watch.ts
import type { ActionResponse } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function watch(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, type, unsubscribe } = params;

	// In a real implementation, we would update the watch status
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message:
			unsubscribe === "true"
				? "Unwatched successfully"
				: "Watched successfully",
	});
}

export async function watchThread(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { threadId } = params;

	if (!threadId) {
		throw new WikidotError("Thread ID is required", "no_thread");
	}

	// In a real implementation, we would update the watch status
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Thread watched successfully",
	});
}

export async function removeWatchedThread(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { threadId } = params;

	if (!threadId) {
		throw new WikidotError("Thread ID is required", "no_thread");
	}

	// In a real implementation, we would update the watch status
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Thread unwatched successfully",
	});
}

export async function watchPage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId } = params;

	if (!pageId) {
		throw new WikidotError("Page ID is required", "no_page");
	}

	// In a real implementation, we would update the watch status
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Page watched successfully",
	});
}

export async function removeWatchedPage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId } = params;

	if (!pageId) {
		throw new WikidotError("Page ID is required", "no_page");
	}

	// In a real implementation, we would update the watch status
	// For mock purposes, we'll just return a success message

	return createActionResponse({
		message: "Page unwatched successfully",
	});
}
