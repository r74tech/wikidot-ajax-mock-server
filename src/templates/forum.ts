// src/templates/forum.ts
import type { Forum, ForumPost, ForumThread } from "../types";

/**
 * Forum comments module templates
 */
export const forumCommentsTemplate = () => `
<div class="comments-box">
	<div class="options" id="comments-options-hidden" >
		<a href="javascript:;" onclick="WIKIDOT.modules.ForumCommentsModule.listeners.showComments(event)">Show Comments</a> 
	</div>
		
	<div id="thread-container" class="thread-container" style="margin-top: 1em">
	</div>
</div>
`;

/**
 * Forum comments list module templates
 */
export const forumCommentsListTemplate = (posts: ForumPost[]) => {
	if (!posts || posts.length === 0) {
		return `<div class="comments-list empty">No comments yet.</div>`;
	}

	const postItems = posts
		.map(
			(post) => `
    <div class="list-item">
      <div class="comment">
        <div class="comment-info">
          <span class="user">User ${post.createdBy}</span>
          <span class="date">${new Date(post.createdAt).toISOString().split("T")[0]}</span>
        </div>
        <div class="comment-content">
          ${post.content}
        </div>
      </div>
    </div>
  `,
		)
		.join("");

	return `<div class="comments-list">${postItems}</div>`;
};

/**
 * Forum new thread module templates
 */
export const forumNewThreadTemplate = (categoryId: number) => `
<div class="forum-new-thread-box">
  <h1>Create a new thread</h1>
  
  <form id="new-thread-form">
    <div class="form-group">
      <label for="thread-title">Thread title:</label>
      <input type="text" id="thread-title" name="title" class="form-control">
    </div>
    
    <div class="form-group">
      <label for="thread-content">Post content:</label>
      <textarea id="thread-content" name="content" rows="15" class="form-control"></textarea>
    </div>
    
    <input type="hidden" name="category_id" value="${categoryId}"/>
    
    <div class="buttons">
      <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.ForumNewThreadModule.listeners.submit()">Create thread</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumNewThreadModule.listeners.preview()">Preview</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumNewThreadModule.listeners.cancel()">Cancel</button>
    </div>
  </form>
</div>
`;

/**
 * Forum preview post module templates
 */
export const forumPreviewPostTemplate = (content: string) => `
<div class="forum-post-preview">
  <h3>Post Preview</h3>
  <div class="preview-content">
    ${content.replace(/\n/g, "<br>")}
  </div>
</div>
`;

/**
 * Forum recent posts module templates
 */
export const forumRecentPostsTemplate = (posts: ForumPost[]) => {
	const postsHtml = generateRecentPostsHtml(posts);

	return `
<div class="forum-recent-posts-box" >
	<form onsubmit="return false;" action="dummy.html" method="get">
		<table class="form">
			<tr>
				<td>
					From categories: 
				</td>
				<td>
					<select id="recent-posts-category">
						<option value="" selected="selected">All categories</option>
					</select>
					<input class="buttons btn btn-primary" type="button" value="Update" onclick="WIKIDOT.modules.ForumRecentPostsModule.listeners.updateList()"/>
				</td>
			</tr>
		</table>
	</form>

	<div id="forum-recent-posts-list">
		${postsHtml}
	</div>
</div>
`;
};

/**
 * Forum recent posts list module templates
 */
export const forumRecentPostsListTemplate = (posts: ForumPost[]) => {
	return generateRecentPostsHtml(posts);
};

/**
 * Forum view thread module template
 */
/**
 * Forum new post form module template
 */
export const forumNewPostFormTemplate = (
	threadId: number,
	parentPostId?: number,
) => `
<div class="forum-new-post-form">
  <h3>${parentPostId ? "Reply to post" : "Post a reply"}</h3>
  <form id="new-post-form">
    <textarea id="post-content" name="content" rows="10" class="form-control"></textarea>
    <div class="buttons">
      <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.ForumNewPostFormModule.listeners.post()">Post</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumNewPostFormModule.listeners.preview()">Preview</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumNewPostFormModule.listeners.cancel()">Cancel</button>
    </div>
  </form>
</div>
`;

/**
 * Forum edit post form module template
 */
export const forumEditPostFormTemplate = (postId: number, content: string) => `
<div class="forum-edit-post-form">
  <h3>Edit post</h3>
  <form id="edit-post-form">
    <textarea id="post-content" name="content" rows="10" class="form-control">${content}</textarea>
    <div class="buttons">
      <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.ForumEditPostFormModule.listeners.save()">Save</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumEditPostFormModule.listeners.preview()">Preview</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumEditPostFormModule.listeners.cancel()">Cancel</button>
    </div>
  </form>
</div>
`;

/**
 * Forum view thread module template
 */
export const forumViewThreadTemplate = (thread: ForumThread) => {
	const postsHtml = thread.posts
		.map(
			(post) => `
    <div class="post" id="post-${post.id}">
      <div class="post-info">
        <span class="user">User ${post.createdBy}</span>
        <span class="date">${new Date(post.createdAt).toISOString().split("T")[0]}</span>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
    </div>
  `,
		)
		.join("");

	return `
<div class="forum-thread-box">
  <h1>${thread.title}</h1>
  
  <div class="thread-container">
    ${postsHtml}
  </div>
  
  <div class="reply-form">
    <h3>Post a reply</h3>
    <form id="reply-form">
      <textarea id="reply-content" name="content" rows="10" class="form-control"></textarea>
      <div class="buttons">
        <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.ForumViewThreadModule.listeners.postReply()">Post</button>
        <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.ForumViewThreadModule.listeners.preview()">Preview</button>
      </div>
    </form>
  </div>
</div>
`;
};

// Helper function to generate posts HTML for both recent posts modules
function generateRecentPostsHtml(posts: ForumPost[]): string {
	if (!posts || posts.length === 0) {
		return `<div id="recent-posts-container"><p>No recent posts.</p></div>`;
	}

	const postItems = posts
		.map(
			(post) => `
    <div class="post" id="post-${post.id}">
      <div class="long">
        <div class="head">
          <div class="title" id="post-title-${post.id}">
            <a href="/forum/t-${post.threadId}/${post.threadId}#post-${post.id}">${post.title}</a>
          </div>
          <div class="info">
            <span class="user">User ${post.createdBy}</span>
            <span class="date">${new Date(post.createdAt).toISOString().split("T")[0]}</span>
            <br/>
            in discussion <a href="/forum/c-${post.threadId}/category">Category</a> &raquo;
            <a href="/forum/t-${post.threadId}/thread">Thread</a>
          </div>
        </div>
        <div class="content" id="post-content-${post.id}">
          ${post.content.substring(0, 200)}${post.content.length > 200 ? "..." : ""}
        </div>
        <div class="options">
          <a href="/forum/t-${post.threadId}/${post.threadId}#post-${post.id}">View full post</a>
        </div>
      </div>
      <div class="short">
        <a class="title" href="/forum/t-${post.threadId}/${post.threadId}#post-${post.id}">${post.title}</a>
        by <span class="user">User ${post.createdBy}</span>,
        <span class="date">${new Date(post.createdAt).toISOString().split("T")[0]}</span>
      </div>
    </div>
  `,
		)
		.join("");

	return `
<div id="recent-posts-container">
  <div class="thread-container">
    ${postItems}
  </div>
</div>
  `;
}
