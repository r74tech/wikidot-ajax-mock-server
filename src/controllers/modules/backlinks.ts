import { store } from "../../data";
// src/controllers/modules/backlinks.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Backlinks module that shows pages linking to the current page
 */
export async function backlinksModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "no_page");
	}

	// Try to get the page from store
	const pageId = typeof page_id === "number" ? page_id : Number(page_id);
	const page = store.getPage(pageId);

	if (!page) {
		throw new WikidotError("Page not found", "no_page");
	}

	// Mock backlinks data
	const html = `<h1>Other pages that depend on this page</h1>
<h2>Backlinks</h2>

    <ul>
                    <li>
                <a href="/nav:top">Topbar menu (nav:top)</a>
            </li>
            </ul>

<h2>Inclusions (using <tt>[[include]]</tt>)</h2>

\tNo pages directly include this page.`;

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
