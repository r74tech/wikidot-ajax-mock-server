// src/types/data.ts
export interface User {
	id: number;
	name: string;
	email: string;
	screenName: string;
	password: string;
	avatar?: string;
	roles: string[];
	createdAt: number;
	sites: number[];
}

export interface Page {
	id: number;
	title: string;
	unixName: string;
	content: string;
	tags: string[];
	categoryId: number;
	createdBy: number;
	createdAt: number;
	updatedBy: number;
	updatedAt: number;
	revisions: PageRevision[];
	comments: Comment[];
	rating: number;
	votes: Record<number, number>; // userId -> vote value
}

export interface PageRevision {
	id: number;
	pageId: number;
	revisionId: number;
	content: string;
	createdBy: number;
	createdAt: number;
	comment: string;
}

export interface Comment {
	id: number;
	parentId?: number;
	content: string;
	createdBy: number;
	createdAt: number;
	updatedAt?: number;
}

export interface Forum {
	id: number;
	title: string;
	description: string;
	categoryId: number;
	threads: ForumThread[];
}

export interface ForumThread {
	id: number;
	forumId: number;
	title: string;
	description: string;
	createdBy: number;
	createdAt: number;
	updatedAt: number;
	posts: ForumPost[];
	isSticky: boolean;
	isLocked: boolean;
}

export interface ForumPost {
	id: number;
	threadId: number;
	parentId?: number;
	title: string;
	content: string;
	createdBy: number;
	createdAt: number;
	updatedAt?: number;
	revisions: ForumPostRevision[];
}

export interface ForumPostRevision {
	id: number;
	postId: number;
	revisionId: number;
	content: string;
	createdBy: number;
	createdAt: number;
}

export interface Site {
	id: number;
	name: string;
	unixName: string;
	description: string;
	members: number[];
	admins: number[];
	moderators: number[];
	createdBy: number;
	createdAt: number;
	settings: Record<string, string | number | boolean | null | undefined>;
}

export interface Category {
	id: number;
	siteId: number;
	name: string;
	description?: string;
	rating?: "p" | "m" | "s" | null; // p: plusOnly, m: plusMinus, s: stars, null: rating disabled
}

export interface File {
	id: number;
	pageId: number;
	name: string;
	size: number;
	mimeType: string;
	uploadedBy: number;
	uploadedAt: number;
	comments?: string;
}

export interface Session {
	userId: number;
	token: string;
	createdAt: number;
	expiresAt: number;
}

export interface AppStore {
	users: User[];
	pages: Page[];
	sites: Site[];
	categories: Category[];
	forums: Forum[];
	files: File[];
	sessions: Session[];
	getUser: (id: number) => User | undefined;
	getPage: (id: number) => Page | undefined;
	getPageByUnixName: (unixName: string) => Page | undefined;
	addUser: (user: Omit<User, "id">) => User;
	addPage: (page: Omit<Page, "id">) => Page;
	updatePage: (id: number, updates: Partial<Page>) => Page | undefined;
	deletePage: (id: number) => boolean;
	// Add more methods as needed
}
