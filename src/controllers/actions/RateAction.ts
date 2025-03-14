import { store } from "../../data";
// src/controllers/actions/rate.ts
import type { ActionResponse } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function ratePage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, points, force } = params;

	if (!pageId) {
		throw new WikidotError("Page ID is required", "no_page");
	}

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Get the rating type from the category
	let ratingType: "p" | "m" | "s" = "p"; // Default to plusOnly
	const category = store.categories.find((cat) => cat.id === page.categoryId);
	if (category?.rating) {
		ratingType = category.rating;
	}

	const userId = 1; // Mock user ID

	// Check if the user has already voted
	if (page.votes[userId] && force !== "true") {
		throw new WikidotError("You have already voted", "already_voted");
	}

	// Record the vote
	const currentPoints = page.votes[userId] || 0;
	const newPoints = Number(points);
	page.votes[userId] = newPoints;

	// Update the page's rating based on rating type
	if (ratingType === "s") {
		// For star ratings, calculate the average of all votes
		let totalPoints = 0;
		let voteCount = 0;

		for (const userId in page.votes) {
			totalPoints += page.votes[userId];
			voteCount++;
		}

		// Calculate average with 1 decimal place precision
		page.rating =
			voteCount > 0 ? Math.round((totalPoints / voteCount) * 10) / 10 : 0;
	} else {
		// For plusOnly and plusMinus, simply add/subtract points
		const pointsDiff = newPoints - currentPoints;
		page.rating += pointsDiff;
	}

	// Return the rating (we'll format it in the response)
	return createActionResponse({
		rating: page.rating,
		// Include rating type in the response so the client knows how to format it
		ratingType,
		message: "Rating submitted successfully",
	});
}

export async function cancelVote(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId } = params;

	if (!pageId) {
		throw new WikidotError("Page ID is required", "no_page");
	}

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Get the rating type from the category
	let ratingType: "p" | "m" | "s" = "p"; // Default to plusOnly
	const category = store.categories.find((cat) => cat.id === page.categoryId);
	if (category?.rating) {
		ratingType = category.rating;
	}

	const userId = 1; // Mock user ID

	// Check if the user has voted
	if (!page.votes[userId]) {
		return createActionResponse({
			message: "No vote to cancel",
		});
	}

	// Get the current vote value
	const currentVote = page.votes[userId];

	// Update the rating based on rating type
	if (ratingType === "s") {
		// For star ratings, recalculate the average after removing this vote
		delete page.votes[userId];

		let totalPoints = 0;
		let voteCount = 0;

		for (const voteUserId in page.votes) {
			totalPoints += page.votes[voteUserId];
			voteCount++;
		}

		// Recalculate the average
		page.rating =
			voteCount > 0 ? Math.round((totalPoints / voteCount) * 10) / 10 : 0;
	} else {
		// For plusOnly and plusMinus, just subtract the points
		page.rating -= currentVote;
		delete page.votes[userId];
	}

	return createActionResponse({
		rating: page.rating,
		ratingType,
		message: "Vote cancelled successfully",
	});
}
