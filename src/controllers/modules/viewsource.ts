import { store } from "../../data";
// src/controllers/modules/viewsource.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * View source module that shows the source code of a page
 */
export async function viewSourceModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	// Try to get the page from store
	const pageId = typeof page_id === "number" ? page_id : Number(page_id);
	const page = store.getPage(pageId);

	if (!page) {
		throw new WikidotError("Page not found", "not_ok");
	}

	// Create HTML view of source
	// Escape HTML entities to display source code correctly
	const escapedSource = page.content
		? page.content
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;")
				.replace(/\n/g, "<br />") // Replace newlines with <br> tags
		: "";

	const html = `<h1>Page source</h1>

<div class="page-source">
\t${escapedSource}
</div>
`;

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
