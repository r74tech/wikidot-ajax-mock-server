import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
// src/controllers/modules/pagetags.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Page tags module - shows and allows editing of page tags
 */
export async function pageTagsModule(
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

	// Get current tags
	const tags = page.tags || [];
	const tagsJoined = tags.join(" ");

	const html = `<div class="page-tags-module">
    <h3>Tags</h3>
    
    <div class="current-tags">
        ${tags.length > 0 ? tags.map((tag) => `<span class="tag">${tag}</span>`).join(" ") : "<em>No tags</em>"}
    </div>
    
    <div class="edit-tags-form">
        <form id="edit-tags-form">
            <div class="form-group">
                <label for="tags-input">Edit tags:</label>
                <input type="text" id="tags-input" name="tags" class="form-control" value="${tagsJoined}" placeholder="Enter tags separated by spaces">
                <small class="form-text text-muted">Separate tags with spaces. Use quotes for multi-word tags, e.g.: "featured article" important</small>
            </div>
            
            <div class="buttons">
                <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.PageTagsModule.listeners.save()">Save</button>
                <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.PageTagsModule.listeners.cancel()">Cancel</button>
            </div>
        </form>
    </div>
    
    ${tagsJoined ? `<input type="hidden" id="original-tags" value="${tagsJoined}">` : ""}
    <input type="hidden" id="page-id" value="${pageId}">
</div>`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/pagetags/PageTagsModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/pagetags/PageTagsModule.css`],
	});
}
