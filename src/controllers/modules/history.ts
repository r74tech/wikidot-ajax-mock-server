import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
// src/controllers/modules/history.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Page history module
 */
export async function pageHistoryModule(
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

	const html = `<h1>Page history of changes</h1>

<form id="history-form-1">
    <table class="form" >
        
        <tr>
            <td>
                Show page changes:
            </td>
            <td>    
                <input class="checkbox" type="checkbox" id="rev-type-all" checked="checked"/>&nbsp;ALL<br/>
                <input class="checkbox" type="checkbox" id="rev-type-source"/>&nbsp;source changes<br/>
                <input class="checkbox" type="checkbox" id="rev-type-title"/>&nbsp;title changes<br/>
                <input class="checkbox" type="checkbox" id="rev-type-move"/>&nbsp;page name changes<br/>
                <input class="checkbox" type="checkbox" id="rev-type-tags"/>&nbsp;tags changes<br/>
                <input class="checkbox" type="checkbox" id="rev-type-meta"/>&nbsp;metadata changes<br/>
                <input class="checkbox" type="checkbox" id="rev-type-files"/>&nbsp;files changes            </td>
        </tr>
        <tr>
            <td>
                Revisions per page:
            </td>
            <td>
                <select id="h-perpage">
                    <option value="20" selected="selected">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </td>
        </tr>
    </table>
    <div class="buttons" >
        <input type="button" class="btn btn-default btn-sm" value="Update list" onclick="WIKIDOT.modules.PageHistoryModule.listeners.updateList(event)"/>
        <input type="button" class="btn btn-default btn-sm" value="Compare versions" name="compare" id="history-compare-button" /> 
    </div>
    
    <div id="revision-list">
        Loading page revisions...    </div>
</form>

<div id="history-subarea" style="display: none">
</div>`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/history/PageHistoryModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/history/PageHistoryModule.css`],
	});
}

/**
 * Page diff module that compares two revisions
 */
export async function pageDiffModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { rev_id1, rev_id2 } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!rev_id1 || !rev_id2) {
		throw new WikidotError(
			"The two revisions you compared are pretty much identical",
			"same_revision",
		);
	}

	// In a real implementation, we would fetch the two revisions and compare them
	const diffHtml = `
<div class="page-diff">
    <h2>Comparing revisions ${rev_id1} and ${rev_id2}</h2>
    
    <div class="diff-header">
        <div class="left-revision">
            <strong>Revision ${rev_id1}</strong><br>
            by Admin User<br>
            2025-03-01 10:00
        </div>
        <div class="right-revision">
            <strong>Revision ${rev_id2}</strong><br>
            by Regular User<br>
            2025-03-02 15:30
        </div>
    </div>
    
    <div class="diff-content">
        <table class="diff-table">
            <tr class="header">
                <td class="line-no">Line</td>
                <td class="old">Old Version</td>
                <td class="new">New Version</td>
            </tr>
            <tr class="unchanged">
                <td class="line-no">1</td>
                <td class="old"><span class="line">This is line 1</span></td>
                <td class="new"><span class="line">This is line 1</span></td>
            </tr>
            <tr class="deleted">
                <td class="line-no">2</td>
                <td class="old"><span class="line">This line was removed</span></td>
                <td class="new">&nbsp;</td>
            </tr>
            <tr class="added">
                <td class="line-no">2</td>
                <td class="old">&nbsp;</td>
                <td class="new"><span class="line">This line was added</span></td>
            </tr>
            <tr class="changed">
                <td class="line-no">3</td>
                <td class="old"><span class="line">This line was <del>changed</del></span></td>
                <td class="new"><span class="line">This line was <ins>modified</ins></span></td>
            </tr>
        </table>
    </div>
</div>
`;

	return createModuleResponse({
		body: diffHtml,
		callbackIndex,
	});
}

/**
 * Page revision list module
 */
export async function pageRevisionListModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id, perpage, offset, types } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	// Mock revision list data
	const revisionListHtml = `
<table class="page-history">
    <tr class="table-header">
        <td class="check radio">&nbsp;</td>
        <td class="check radio">&nbsp;</td>
        <td class="revision">Rev.</td>
        <td class="datetime">Date/Time</td>
        <td class="user">User</td>
        <td class="comment">Comment</td>
        <td class="changes">&nbsp;</td>
    </tr>
    <tr class="revision-row odd">
        <td class="check radio"><input type="radio" name="from" value="12345" /></td>
        <td class="check radio"><input type="radio" name="to" value="12345" checked="checked" /></td>
        <td class="revision">2</td>
        <td class="datetime">2025-03-02 15:30</td>
        <td class="user">Regular User</td>
        <td class="comment">Updated formatting</td>
        <td class="changes"><a href="javascript:;" onclick="WIKIDOT.modules.PageHistoryModule.listeners.viewSource(12345)">View source</a></td>
    </tr>
    <tr class="revision-row even">
        <td class="check radio"><input type="radio" name="from" value="12344" checked="checked" /></td>
        <td class="check radio"><input type="radio" name="to" value="12344" /></td>
        <td class="revision">1</td>
        <td class="datetime">2025-03-01 10:00</td>
        <td class="user">Admin User</td>
        <td class="comment">Initial version</td>
        <td class="changes"><a href="javascript:;" onclick="WIKIDOT.modules.PageHistoryModule.listeners.viewSource(12344)">View source</a></td>
    </tr>
</table>
`;

	return createModuleResponse({
		body: revisionListHtml,
		callbackIndex,
	});
}

/**
 * Page source module for viewing a specific revision
 */
export async function pageSourceModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id, revision_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	if (!revision_id) {
		throw new WikidotError("Revision ID is required", "not_ok");
	}

	// Mock revision source data
	const revisionSource = `[[include :irongiant:clone]]

This is a blank, minimalist template. All optional components have been removed so you can immediately start adding functionality, rather than removing the parts that you don't want.  For experienced Wikidot users.

------

++ Pages

[[module ListPages category="*" pagetype="*" separate="no"]]
%%linked_title%% ([%%link%%/edit/true Edit])
[[/module]]`;

	// Escape HTML entities to display source code correctly
	const escapedSource = revisionSource
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;")
		.replace(/\n/g, "<br />"); // Replace newlines with <br> tags

	const html = `<h1>Revision Source</h1>
<div class="revision-info">
    <p>
        <strong>Revision:</strong> ${revision_id}<br>
        <strong>Date:</strong> 2025-03-01 10:00<br>
        <strong>User:</strong> Admin User<br>
        <strong>Comment:</strong> Initial version
    </p>
</div>

<div class="page-source">
    ${escapedSource}
</div>
`;

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
