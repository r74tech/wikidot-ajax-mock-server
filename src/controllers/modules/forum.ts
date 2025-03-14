import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
import { initialForums } from "../../data/initial-state";
import {
	forumCommentsListTemplate,
	forumCommentsTemplate,
	forumEditPostFormTemplate,
	forumNewPostFormTemplate,
	forumNewThreadTemplate,
	forumPreviewPostTemplate,
	forumRecentPostsListTemplate,
	forumRecentPostsTemplate,
	forumViewThreadTemplate,
} from "../../templates/forum";
// src/controllers/modules/forum.ts
import type { ForumThread, ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Forum new thread module
 */
export async function forumNewThreadModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { category_id, forum_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!category_id && !forum_id) {
		throw new WikidotError("No forum category has been specified.", "not_ok");
	}

	// Convert category_id to number if it exists
	const categoryId = category_id ? Number(category_id) : 1;

	// Generate the HTML using the template
	const html = forumNewThreadTemplate(categoryId);

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumNewThreadModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumNewThreadModule.css`],
	});
}

/**
 * Forum view thread module
 */
export async function forumViewThreadModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { thread_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!thread_id) {
		throw new WikidotError("Thread ID is required", "not_ok");
	}

	// Find the thread in our initial forums data or create a mock one
	const threadId = Number(thread_id);

	let thread: ForumThread | undefined;

	// Try to find the thread in initialForums
	for (const forum of initialForums) {
		thread = forum.threads.find((t) => t.id === threadId);
		if (thread) break;
	}

	// If thread not found, create a mock one
	if (!thread) {
		thread = {
			id: threadId,
			forumId: 1,
			title: "Thread Title",
			description: "Mock thread for testing",
			createdBy: 1,
			createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
			updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
			posts: [
				{
					id: 1,
					threadId: threadId,
					title: "Thread Title",
					content: "This is the thread content.",
					createdBy: 1,
					createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
					revisions: [],
				},
				{
					id: 2,
					threadId: threadId,
					parentId: 1,
					title: "Re: Thread Title",
					content: "This is a reply to the thread.",
					createdBy: 3,
					createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
					revisions: [],
				},
			],
			isSticky: false,
			isLocked: false,
		};
	}

	// Generate HTML using the template
	const html = forumViewThreadTemplate(thread);

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumViewThreadModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumViewThreadModule.css`],
	});
}

/**
 * Forum preview post module
 */
export async function forumPreviewPostModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { content } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!content) {
		throw new WikidotError("Post is empty.", "post_empty");
	}

	const contentStr =
		typeof content === "string" ? content : String(content || "");
	const html = forumPreviewPostTemplate(contentStr);

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}

/**
 * Forum new post form module
 */
export async function forumNewPostFormModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { thread_id, parent_post_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!thread_id) {
		throw new WikidotError("Thread ID is required", "not_ok");
	}

	const threadId = Number(thread_id);
	const parentPostId = parent_post_id ? Number(parent_post_id) : undefined;

	// Generate HTML using the template
	const html = forumNewPostFormTemplate(threadId, parentPostId);

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumNewPostFormModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumNewPostFormModule.css`],
	});
}

/**
 * Forum edit post form module
 */
export async function forumEditPostFormModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { post_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!post_id) {
		throw new WikidotError("Post ID is required", "not_ok");
	}

	// Mock post content
	const postContent = "This is the post content that is being edited.";
	const postId = Number(post_id);

	// Generate HTML using the template
	const html = forumEditPostFormTemplate(postId, postContent);

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumEditPostFormModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumEditPostFormModule.css`],
	});
}

/**
 * Forum comments module
 */
export async function forumCommentsModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	const html = forumCommentsTemplate();

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumCommentsModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumCommentsModule.css`],
	});
}

/**
 * Forum recent posts module
 */
export async function forumRecentPostsModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	// Use an empty array to use the default template content
	const html = forumRecentPostsTemplate([]);

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/forum/ForumRecentPostsModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/forum/ForumRecentPostsModule.css`],
	});
}

/**
 * Forum Recent Posts List Module
 */
export async function forumRecentPostsListModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	// Use an empty array to use the default template content
	const html = forumRecentPostsListTemplate([]);

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}

/**
 * Forum Comments List Module
 */
export async function forumCommentsListModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Can not find related page.", "no_page");
	}

	// Use an empty array to use the default template content
	const html = forumCommentsListTemplate([]);

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
