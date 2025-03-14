import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
// src/controllers/modules/search.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Search module
 */
export async function searchModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { q, site_id, scope, offset, order } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	// Check if search query is provided
	if (!q) {
		throw new WikidotError("検索クエリを入力してください", "not_ok");
	}

	const searchQuery = typeof q === "string" ? q : String(q);
	const searchSiteId = site_id
		? typeof site_id === "number"
			? site_id
			: Number(site_id)
		: 1;
	const searchOffset = offset
		? typeof offset === "number"
			? offset
			: Number(offset)
		: 0;
	const searchOrder = typeof order === "string" ? order : "relevance";

	// Get all pages for mock search results
	const allPages = store.pages;

	// Simple mock search - in a real implementation this would be much more sophisticated
	const results = allPages
		.filter((page) => {
			// Basic content search
			return (
				page.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				page.content?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		})
		.slice(searchOffset, searchOffset + 10); // Pagination

	// Build results HTML
	let resultsHtml = "";
	if (results.length > 0) {
		resultsHtml = results
			.map(
				(page) => `
        <div class="search-result-item">
            <h3><a href="/${page.unixName}">${page.title}</a></h3>
            <div class="search-result-snippet">
                ${
									page.content
										? page.content.substring(0, 200) +
											(page.content.length > 200 ? "..." : "")
										: "No content"
								}
            </div>
            <div class="search-result-meta">
                <span class="search-result-rating">評価: ${page.rating || 0}</span>
                <span class="search-result-date">最終更新: ${new Date(page.updatedAt).toLocaleDateString("ja-JP")}</span>
                <span class="search-result-comments">コメント: ${page.comments?.length || 0}</span>
            </div>
        </div>
        `,
			)
			.join("");
	} else {
		resultsHtml = `
        <div class="search-no-results">
            <p>"${searchQuery}"に一致する結果はありませんでした。</p>
            <p>検索のヒント:</p>
            <ul>
                <li>スペルが正しいか確認してください。</li>
                <li>別のキーワードを試してください。</li>
                <li>より一般的な検索語を使用してください。</li>
            </ul>
        </div>
        `;
	}

	// Full module HTML
	const html = `
<div class="search-module">
    <h1>検索結果: "${searchQuery}"</h1>
    
    <div class="search-header">
        <form id="search-form" action="/search:site/q/{{q}}" method="get">
            <div class="search-input-container">
                <input type="text" name="q" value="${searchQuery}" class="search-input" placeholder="検索...">
                <button type="submit" class="search-button">検索</button>
            </div>
            
            <div class="search-options">
                <label>
                    <input type="radio" name="scope" value="site" ${scope !== "page" ? "checked" : ""}>
                    サイト全体を検索
                </label>
                <label>
                    <input type="radio" name="scope" value="page" ${scope === "page" ? "checked" : ""}>
                    現在のページを検索
                </label>
            </div>
        </form>
    </div>
    
    <div class="search-results-info">
        <p>${results.length} 件の結果があります</p>
        
        <div class="search-sort-options">
            並び替え:
            <select id="search-order" onchange="WIKIDOT.modules.SearchModule.listeners.changeOrder('${searchQuery}', this.value)">
                <option value="relevance" ${searchOrder === "relevance" ? "selected" : ""}>関連性</option>
                <option value="date" ${searchOrder === "date" ? "selected" : ""}>更新日</option>
                <option value="rating" ${searchOrder === "rating" ? "selected" : ""}>評価</option>
            </select>
        </div>
    </div>
    
    <div class="search-results">
        ${resultsHtml}
    </div>
    
    <!-- Pagination if needed -->
    ${
			results.length > 0
				? `
    <div class="search-pagination">
        ${
					searchOffset > 0
						? `<a href="javascript:;" onclick="WIKIDOT.modules.SearchModule.listeners.changePage('${searchQuery}', ${Math.max(0, searchOffset - 10)})" class="pagination-prev">前へ</a>`
						: `<span class="pagination-prev disabled">前へ</span>`
				}
        
        <span class="pagination-current">ページ ${Math.floor(searchOffset / 10) + 1}</span>
        
        ${
					results.length === 10
						? `<a href="javascript:;" onclick="WIKIDOT.modules.SearchModule.listeners.changePage('${searchQuery}', ${searchOffset + 10})" class="pagination-next">次へ</a>`
						: `<span class="pagination-next disabled">次へ</span>`
				}
    </div>
    `
				: ""
		}
</div>
`;

	return createModuleResponse({
		body: html,
		title: `検索結果: "${searchQuery}"`,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/search/SearchModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/search/SearchModule.css`],
	});
}
