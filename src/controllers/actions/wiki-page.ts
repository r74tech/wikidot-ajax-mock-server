import { store } from "../../data";
// src/controllers/actions/wiki-page.ts
import type { ActionResponse } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function savePage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { page_id, wiki_page, title, source, comments } = params;

	// Editing an existing page
	if (page_id) {
		const page = store.getPage(Number(page_id));
		if (!page) {
			throw new WikidotError("Page not found", "no_page");
		}

		// In a real implementation, we would validate the lock
		// For mock purposes, we'll accept any lock_id and lock_secret

		// Create a new revision
		const newRevisionId =
			Math.max(...page.revisions.map((r) => r.revisionId), 0) + 1;
		const newRevision = {
			id: Math.max(...page.revisions.map((r) => r.id), 0) + 1,
			pageId: page.id,
			revisionId: newRevisionId,
			content: String(source),
			createdBy: 1, // Mock user ID
			createdAt: Date.now(),
			comment: String(comments || ""),
		};

		// Update the page
		store.updatePage(page.id, {
			content: String(source || ""),
			updatedBy: 1, // Mock user ID
			updatedAt: Date.now(),
			revisions: [...page.revisions, newRevision],
		});

		return createActionResponse({
			page_id: page.id,
			revision_id: newRevisionId,
		});
	}

	// New page
	if (!wiki_page) {
		throw new WikidotError("Page name is required", "form_errors");
	}

	// Check if the page already exists
	const existingPage = store.getPageByUnixName(String(wiki_page));
	if (existingPage) {
		throw new WikidotError("Page already exists", "page_exists");
	}

	// Create a new page
	const newPage = store.addPage({
		title: String(title || wiki_page),
		unixName: String(wiki_page),
		content: String(source || ""),
		tags: [],
		categoryId: 1, // Default category
		createdBy: 1, // Mock user ID
		createdAt: Date.now(),
		updatedBy: 1, // Mock user ID
		updatedAt: Date.now(),
		revisions: [
			{
				id: 1,
				pageId: 0, // Will be updated once we have the page ID
				revisionId: 1,
				content: String(source || ""),
				createdBy: 1, // Mock user ID
				createdAt: Date.now(),
				comment: String(comments || ""),
			},
		],
		comments: [],
		rating: 0,
		votes: {},
	});

	// Update the revision with the correct page ID
	newPage.revisions[0].pageId = newPage.id;

	return createActionResponse({
		page_id: newPage.id,
		revision_id: 1,
	});
}

export async function removePageEditLock(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { lock_id, lock_secret } = params;

	// In a real implementation, we would validate and remove the lock
	// For mock purposes, we'll accept any lock_id and lock_secret

	return createActionResponse({
		message: "Lock removed successfully",
	});
}

export async function updateLock(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { page_id, lock_id, lock_secret, since_last_input } = params;

	// In a real implementation, we would validate and update the lock
	// For mock purposes, we'll accept any lock_id and lock_secret

	return createActionResponse({
		timeLeft: 300, // 5 minutes in seconds
	});
}

export async function renamePage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { page_id, new_name, fixdeps, force } = params;

	if (!new_name) {
		throw new WikidotError("New name is required", "no_new_name");
	}

	// Check if the page exists
	const page = store.getPage(Number(page_id));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Check if a page with the new name already exists
	const existingPage = store.getPageByUnixName(String(new_name));
	if (existingPage && existingPage.id !== page.id && force !== "yes") {
		throw new WikidotError(
			"A page with that name already exists",
			"page_exists",
		);
	}

	// Update the page
	const newNameStr = String(new_name);
	store.updatePage(page.id, {
		unixName: newNameStr,
		title: newNameStr.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
	});

	return createActionResponse({
		message: "Page renamed successfully",
	});
}

export async function setParentPage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, parentName } = params;

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// If parentName is null, then we're removing the parent
	if (!parentName) {
		// Remove parent reference (this would be handled differently in a real implementation)
		return createActionResponse({
			message: "Parent page removed",
		});
	}

	// Check if the parent page exists
	const parentPage = store.getPageByUnixName(parentName ? String(parentName) : "");
	if (!parentPage) {
		throw new WikidotError("Parent page not found", "no_parent_page");
	}

	// Check for loops
	if (parentPage.id === page.id) {
		throw new WikidotError("A page cannot be its own parent", "loop_error");
	}

	// In a real implementation, we would set the parent page

	return createActionResponse({
		message: "Parent page set successfully",
	});
}

export async function revert(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, revisionId } = params;

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Check if the revision exists
	const revision = page.revisions.find(
		(r) => r.revisionId === Number(revisionId),
	);
	if (!revision) {
		throw new WikidotError("Revision not found", "no_revision");
	}

	// Create a new revision with the content of the old one
	const newRevisionId =
		Math.max(...page.revisions.map((r) => r.revisionId), 0) + 1;
	const newRevision = {
		id: Math.max(...page.revisions.map((r) => r.id), 0) + 1,
		pageId: page.id,
		revisionId: newRevisionId,
		content: revision.content,
		createdBy: 1, // Mock user ID
		createdAt: Date.now(),
		comment: `Reverted to revision ${revisionId}`,
	};

	// Update the page
	store.updatePage(page.id, {
		content: revision.content,
		updatedBy: 1, // Mock user ID
		updatedAt: Date.now(),
		revisions: [...page.revisions, newRevision],
	});

	return createActionResponse({
		message: "Page reverted successfully",
		revision_id: newRevisionId,
	});
}

export async function saveTags(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, tags } = params;

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Process the tags
	const tagArray = tags ? String(tags).split(/[\s,]+/).filter(Boolean) : [];

	// Check if tags actually changed
	const currentTags = new Set(page.tags);
	const newTags = new Set(tagArray);

	if (
		currentTags.size === newTags.size &&
		[...currentTags].every((tag) => newTags.has(tag))
	) {
		return createActionResponse({
			message: "No changes to tags",
			status: "no_change",
		});
	}

	// Update the page
	store.updatePage(page.id, {
		tags: tagArray,
		updatedBy: 1, // Mock user ID
		updatedAt: Date.now(),
	});

	return createActionResponse({
		message: "Tags updated successfully",
	});
}

export async function updateTagsByButton(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, tags } = params;

	// This is similar to saveTags but with different UI flow
	return await saveTags(params);
}

export async function saveBlock(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { pageId, block } = params;

	// Check if the page exists
	const page = store.getPage(Number(pageId));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// In a real implementation, we would set the block status

	return createActionResponse({
		message:
			block === "true"
				? "Page blocked successfully"
				: "Page unblocked successfully",
	});
}

export async function deletePage(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { page_id } = params;

	// Check if the page exists
	const page = store.getPage(Number(page_id));
	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Delete the page
	const success = store.deletePage(page.id);

	if (!success) {
		throw new WikidotError("Failed to delete page", "not_ok");
	}

	return createActionResponse({
		message: "Page deleted successfully",
	});
}
