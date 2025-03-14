import { store } from "../../data";
// src/controllers/actions/forum.ts
import type { ActionResponse, Forum, ForumThread, ForumPost, ForumPostRevision } from "../../types";
import { WikidotError, createActionResponse } from "../../utils";

export async function newThread(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { title, description, source, category_id } = params;

	if (!title) {
		throw new WikidotError("Title is required", "form_errors");
	}

	if (!source) {
		throw new WikidotError("Content is required", "form_errors");
	}

	if (!category_id) {
		throw new WikidotError("Category is required", "no_category");
	}

	// Find the forum by category ID
	const forum = store.forums.find((f) => f.categoryId === Number(category_id));

	if (!forum) {
		throw new WikidotError("Forum not found", "no_category");
	}

	// Create a new thread ID
	const threadId =
		Math.max(...store.forums.flatMap((f) => f.threads.map((t) => t.id)), 0) + 1;

	// Create a new post ID
	const postId =
		Math.max(
			...store.forums.flatMap((f) =>
				f.threads.flatMap((t) => t.posts.map((p) => p.id)),
			),
			0,
		) + 1;

	// Create a new thread
	const newThread = {
		id: threadId,
		forumId: forum.id,
		title: String(title),
		description: String(description || ""),
		createdBy: 1, // Mock user ID
		createdAt: Date.now(),
		updatedAt: Date.now(),
		posts: [
			{
				id: postId,
				threadId,
				title: String(title),
				content: String(source),
				createdBy: 1, // Mock user ID
				createdAt: Date.now(),
				revisions: [],
			},
		],
		isSticky: false,
		isLocked: false,
	};

	// Add the thread to the forum
	forum.threads.push(newThread);

	return createActionResponse({
		thread_id: threadId,
		thread_unix_title: String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
	});
}

export async function savePost(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { title, source, threadId, parentId } = params;

	if (!title) {
		throw new WikidotError("Title is required", "form_errors");
	}

	if (!source) {
		throw new WikidotError("Content is required", "form_errors");
	}

	if (!threadId) {
		throw new WikidotError("Thread ID is required", "no_thread");
	}

	// Find the thread
	let thread: ForumThread | null = null;
	let forum: Forum | null = null;

	for (const f of store.forums) {
		const t = f.threads.find((t) => t.id === Number(threadId));
		if (t) {
			thread = t;
			forum = f;
			break;
		}
	}

	if (!thread) {
		throw new WikidotError("Thread not found", "no_thread");
	}

	// Create a new post ID
	const postId =
		Math.max(
			...store.forums.flatMap((f) =>
				f.threads.flatMap((t) => t.posts.map((p) => p.id)),
			),
			0,
		) + 1;

	// Create a new post
	const newPost = {
		id: postId,
		threadId: thread.id,
		parentId: parentId ? Number(parentId) : undefined,
		title: String(title),
		content: String(source),
		createdBy: 1, // Mock user ID
		createdAt: Date.now(),
		revisions: [],
	};

	// Add the post to the thread
	thread.posts.push(newPost);

	// Update the thread's last updated timestamp
	thread.updatedAt = Date.now();

	return createActionResponse({
		post_id: postId,
		thread_id: thread.id,
	});
}

export async function saveEditPost(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { title, source, threadId, postId, currentRevisionId } = params;

	if (!title) {
		throw new WikidotError("Title is required", "form_errors");
	}

	if (!source) {
		throw new WikidotError("Content is required", "form_errors");
	}

	if (!threadId || !postId) {
		throw new WikidotError("Thread ID and Post ID are required", "no_thread");
	}

	// Find the thread and post
	let thread: ForumThread | null = null;
	let post: ForumPost | null = null;
	let forum: Forum | null = null;

	for (const f of store.forums) {
		const t = f.threads.find((t) => t.id === Number(threadId));
		if (t) {
			thread = t;
			forum = f;
			post = t.posts.find((p) => p.id === Number(postId)) || null;
			break;
		}
	}

	if (!thread || !post) {
		throw new WikidotError("Post not found", "no_post");
	}

	// Create a new revision
	const newRevision = {
		id: Math.max(...post.revisions.map((r: ForumPostRevision) => r.id || 0), 0) + 1,
		postId: post.id,
		revisionId:
			Math.max(...post.revisions.map((r: ForumPostRevision) => r.revisionId || 0), 0) + 1,
		content: post.content, // Save the current content as a revision
		createdBy: post.createdBy,
		createdAt: post.createdAt,
	};

	// Add the revision to the post
	post.revisions.push(newRevision);

	// Update the post
	post.title = String(title);
	post.content = String(source);
	post.updatedAt = Date.now();

	// Update the thread's last updated timestamp
	thread.updatedAt = Date.now();

	return createActionResponse({
		post_id: post.id,
		thread_id: thread.id,
	});
}

export async function saveThreadMeta(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { threadId, title, description } = params;

	if (!threadId) {
		throw new WikidotError("Thread ID is required", "no_thread");
	}

	if (!title) {
		throw new WikidotError("Title is required", "form_errors");
	}

	// Find the thread
	let thread: ForumThread | null = null;
	let forum: Forum | null = null;

	for (const f of store.forums) {
		const t = f.threads.find((t) => t.id === Number(threadId));
		if (t) {
			thread = t;
			forum = f;
			break;
		}
	}

	if (!thread) {
		throw new WikidotError("Thread not found", "no_thread");
	}

	// Update the thread
	thread.title = String(title);
	thread.description = String(description || "");

	return createActionResponse({
		thread_id: thread.id,
	});
}

export async function deletePost(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ActionResponse> {
	const { postId } = params;

	if (!postId) {
		throw new WikidotError("Post ID is required", "no_post");
	}

	// Find the post
	let post: ForumPost | null = null;
	let thread: ForumThread | null = null;
	let forum: Forum | null = null;

	for (const f of store.forums) {
		for (const t of f.threads) {
			const p = t.posts.find((p) => p.id === Number(postId));
			if (p) {
				post = p;
				thread = t;
				forum = f;
				break;
			}
		}
		if (post) break;
	}

	if (!thread || !post) {
		throw new WikidotError("Post not found", "no_post");
	}

	// Remove the post from the thread
	thread.posts = thread.posts.filter((p: ForumPost) => p.id !== post.id);

	return createActionResponse({
		post_id: post.id,
		thread_id: thread.id,
	});
}
