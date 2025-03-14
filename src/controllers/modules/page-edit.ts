import { store } from "../../data";
import {
	createFormTemplate,
	editFormTemplate,
} from "../../templates/page-edit";
// src/controllers/modules/page-edit.ts
import type { ModuleResponse, Page } from "../../types";
import {
	WikidotError,
	createModuleResponse,
	generateWikidotToken,
} from "../../utils";

export async function pageEditModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	console.log("PageEditModule params:", params); // Log parameters for debugging

	const { page_id, mode, wiki_page, force_lock, section, wikidot_token7 } =
		params;
	const callbackIndex = String(params.callbackIndex || "0");

	// Create a mock lock
	const lockId = Math.floor(Math.random() * 100000000);
	const lockSecret = generateWikidotToken();
	const timeLeft = 900; // 15 minutes in seconds

	// Handle editing an existing page
	if (page_id) {
		// Try to get the page from store
		const existingPage = store.getPage(Number(page_id));

		// If page exists, use it
		if (existingPage) {
			const html = editFormTemplate(existingPage, lockId, lockSecret, timeLeft);

			// Get the latest revision ID
			const pageRevisionId =
				existingPage.revisions.length > 0
					? existingPage.revisions[existingPage.revisions.length - 1].revisionId
					: Math.floor(Math.random() * 2000000000);

			return createModuleResponse({
				status: "ok",
				mode: mode || "page",
				lock_id: lockId,
				lock_secret: lockSecret,
				page_revision_id: pageRevisionId,
				timeLeft: timeLeft,
				body: html,
				callbackIndex,
			});
		}

		// Create a mock page that fulfills the Page interface
		const now = Date.now();
		const mockPage: Page = {
			id: Number(page_id),
			title: "Sample Page Title",
			unixName: "sample-page-title",
			content: "Sample page content",
			tags: [],
			categoryId: 1,
			createdBy: 1,
			createdAt: now,
			updatedBy: 1,
			updatedAt: now,
			revisions: [
				{
					id: 1,
					pageId: Number(page_id),
					revisionId: Math.floor(Math.random() * 2000000000),
					content: "Sample page content",
					createdBy: 1,
					createdAt: now,
					comment: "Initial version",
				},
			],
			comments: [],
			rating: 0,
			votes: {},
		};

		const html = editFormTemplate(mockPage, lockId, lockSecret, timeLeft);

		return createModuleResponse({
			status: "ok",
			mode: mode || "page",
			lock_id: lockId,
			lock_secret: lockSecret,
			page_revision_id: mockPage.revisions[0].revisionId,
			timeLeft: timeLeft,
			body: html,
			callbackIndex,
		});
	}

	// Handle creating a new page
	if (wiki_page && typeof wiki_page === "string") {
		const title = wiki_page.replace(/-/g, " ");
		const html = createFormTemplate(
			title,
			wiki_page,
			lockId,
			lockSecret,
			timeLeft,
		);

		return createModuleResponse({
			status: "ok",
			mode: mode || "page",
			lock_id: lockId,
			lock_secret: lockSecret,
			timeLeft: timeLeft,
			body: html,
			callbackIndex,
		});
	}

	throw new WikidotError("Invalid parameters", "not_ok");
}

export async function pagePreviewModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	console.log("PagePreviewModule params:", params); // Log parameters for debugging

	const { source, title, page_unix_name } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	// In a real implementation, we would render the source
	// For mock purposes, we'll just return the source as HTML
	const sourceStr = typeof source === "string" ? source : String(source || "");
	const titleStr =
		typeof title === "string" ? title : String(title || "Preview");

	const html = `
<div class="preview-page">
  <h1>${titleStr}</h1>
  <div class="preview-content">
    <p>${sourceStr.replace(/\n/g, "<br>") || "No content provided."}</p>
  </div>
</div>
`;

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
