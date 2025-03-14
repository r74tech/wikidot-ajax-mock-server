import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
import {
	generateDisabledRateWidget,
	generatePageRateWidget,
	generatePageRateWidgetBox,
	generatePlusOnlyRateWidgetBox,
} from "../../templates";
// src/controllers/modules/watch.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Page watch status module
 */
export async function pageWatchStatusModule(
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

	// Mock watch status - could be stored in the user's data in a real implementation
	const isWatched = true; // For demo, assume the page is watched

	const html = `
<div class="page-watch-status-module">
  <h3>ページ購読状態</h3>
  
  <div class="watch-status">
    ${
			isWatched
				? `<p class="status-watched"><strong>このページを購読しています</strong></p>
      <p><a href="javascript:;" onclick="WIKIDOT.modules.PageWatchModule.listeners.unwatch(${pageId})">購読を停止</a></p>`
				: `<p class="status-not-watched">このページを購読していません</p>
      <p><a href="javascript:;" onclick="WIKIDOT.modules.PageWatchModule.listeners.watch(${pageId})">購読する</a></p>`
		}
  </div>
  
  <div class="watch-options">
    <h4>購読オプション</h4>
    <form>
      <div>
        <input type="radio" id="watch-option-default" name="watch-option" value="default" checked />
        <label for="watch-option-default">デフォルト</label>
      </div>
      <div>
        <input type="radio" id="watch-option-emails" name="watch-option" value="emails" />
        <label for="watch-option-emails">メールで通知</label>
      </div>
      <div>
        <input type="radio" id="watch-option-no-emails" name="watch-option" value="no-emails" />
        <label for="watch-option-no-emails">メールしない</label>
      </div>
      
      <button type="button" class="btn btn-sm" onclick="WIKIDOT.modules.PageWatchModule.listeners.saveOptions(${pageId})">保存</button>
    </form>
  </div>
</div>
`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/watch/PageWatchModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/watch/PageWatchModule.css`],
	});
}

/**
 * Not logged in module
 */
export async function notLoggedInModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	const html = `
<div class="not-logged-in-module">
  <p>この機能を使用するにはログインが必要です。</p>
  
  <div class="actions">
    <a href="javascript:;" onclick="WIKIDOT.modules.LoginModule.listeners.showLoginForm()" class="btn btn-primary">ログイン</a>
    <a href="/join" class="btn btn-default">アカウント登録</a>
  </div>
</div>
`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/login/LoginModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/login/LoginModule.css`],
	});
}

/**
 * Page rate module
 */
export async function pageRateModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	// The request uses 'pageId' parameter which can be numeric or non-numeric
	const pageId = params.pageId;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!pageId) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	// Store the original pageId for use in templates
	const originalPageId = pageId;

	// Default values in case we can't find the page or category
	let currentRating = 0;
	let ratingType: "p" | "m" | "s" = "p"; // Default to plusOnly
	let currentPage = null;

	// Only try to get the page from store if the ID is numeric
	if (
		typeof pageId === "number" ||
		(typeof pageId === "string" && !Number.isNaN(Number(pageId)))
	) {
		try {
			const numericPageId =
				typeof pageId === "number" ? pageId : Number(pageId);
			const page = store.getPage(numericPageId);

			if (page) {
				currentPage = page;
				currentRating = page.rating;

				// Get the category to determine the rating type
				const category = store.categories.find(
					(cat) => cat.id === page.categoryId,
				);
				if (category?.rating) {
					ratingType = category.rating;
				}
			}
		} catch (error) {
			console.error(`Error retrieving page with ID ${pageId}:`, error);
			// Continue with default data if there's an error
		}
	}

	// Random class ID for the rating span in the widget box style
	const ratingClassId = "prw54353";

	// Ensure we're passing the correct types to our template functions
	const pageIdForTemplate =
		typeof originalPageId === "boolean"
			? String(originalPageId)
			: originalPageId;

	// Generate the HTML based on the rating type from the category
	let html: string;

	// Check if category exists and has rating (null means rating is disabled)
	const categoryForPage = currentPage
		? store.categories.find((cat) => cat.id === currentPage.categoryId)
		: null;

	if (
		!categoryForPage ||
		categoryForPage.rating === undefined ||
		categoryForPage.rating === null
	) {
		// Rating is disabled for this category
		html = generateDisabledRateWidget();
	} else if (ratingType === "s") {
		// Stars rating (1-5)
		html = generatePageRateWidget(currentRating, pageIdForTemplate);
	} else if (ratingType === "p") {
		// PlusOnly rating (only +1 votes)
		html = generatePlusOnlyRateWidgetBox(
			currentRating,
			pageIdForTemplate,
			ratingClassId,
		);
	} else {
		// PlusMinus rating (+1/-1 votes)
		html = generatePageRateWidgetBox(
			currentRating,
			pageIdForTemplate,
			ratingClassId,
		);
	}

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [
			`${WIKIDOT_COMMON_JS}/pagerate/PageRateWidgetModule.js`,
			`${WIKIDOT_COMMON_JS}/pagerate/PageRateWidgetModule.js`,
			`${WIKIDOT_COMMON_JS}/pagerate/PageRateModule.js`,
		],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/pagerate/PageRateWidgetModule.css`],
	});
}
