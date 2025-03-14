// src/data/initial-state.ts
import type {
	Category,
	File,
	Forum,
	ForumPost,
	ForumThread,
	Page,
	Session,
	Site,
	User,
} from "../types";

export const initialUsers: User[] = [
	{
		id: 1,
		name: "admin",
		email: "admin@example.com",
		screenName: "Admin User",
		password: "password123",
		avatar: "/avatars/admin.jpg",
		roles: ["admin"],
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
		sites: [1],
	},
	{
		id: 2,
		name: "moderator",
		email: "mod@example.com",
		screenName: "Moderator User",
		password: "password123",
		avatar: "/avatars/mod.jpg",
		roles: ["moderator"],
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 180, // 180 days ago
		sites: [1],
	},
	{
		id: 3,
		name: "user",
		email: "user@example.com",
		screenName: "Regular User",
		password: "password123",
		avatar: "/avatars/user.jpg",
		roles: ["user"],
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
		sites: [1],
	},
];

export const initialPages: Page[] = [
	// Category 1 - PlusOnly rating page
	{
		id: 1,
		title: "PlusOnly Rating Example",
		unixName: "plusonly-rating",
		content:
			"# PlusOnly Rating Example\n\nThis page demonstrates the PlusOnly rating system.",
		tags: ["sample", "rating", "plusonly"],
		categoryId: 1, // Main category with 'p' rating
		createdBy: 1,
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
		updatedBy: 1,
		updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
		revisions: [
			{
				id: 1,
				pageId: 1,
				revisionId: 1,
				content: "# PlusOnly Rating Example\n\nInitial content.",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
				comment: "Initial version",
			},
			{
				id: 2,
				pageId: 1,
				revisionId: 2,
				content:
					"# PlusOnly Rating Example\n\nThis page demonstrates the PlusOnly rating system.",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
				comment: "Updated formatting",
			},
		],
		comments: [
			{
				id: 1,
				content: "Great page!",
				createdBy: 2,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
			},
			{
				id: 2,
				content: "Thanks for the information.",
				createdBy: 3,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
			},
		],
		rating: 3, // PlusOnly - positive count
		votes: {
			1: 1, // User 1 voted +1
			2: 1, // User 2 voted +1
			3: 1, // User 3 voted +1
		},
	},

	// Category 2 - PlusMinus rating page
	{
		id: 2,
		title: "PlusMinus Rating Example",
		unixName: "plusminus-rating",
		content:
			"# PlusMinus Rating Example\n\nThis page demonstrates the PlusMinus rating system.",
		tags: ["sample", "rating", "plusminus"],
		categoryId: 2, // System category with 'm' rating
		createdBy: 2,
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago
		updatedBy: 2,
		updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 8, // 8 days ago
		revisions: [
			{
				id: 3,
				pageId: 2,
				revisionId: 1,
				content:
					"# PlusMinus Rating Example\n\nThis page demonstrates the PlusMinus rating system.",
				createdBy: 2,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
				comment: "Initial version",
			},
		],
		comments: [],
		rating: 1, // Net score of positive and negative votes
		votes: {
			1: 1, // User 1 voted +1
			2: 1, // User 2 voted +1
			3: -1, // User 3 voted -1
		},
	},

	// Category 3 - Stars rating page
	{
		id: 3,
		title: "Stars Rating Example",
		unixName: "stars-rating",
		content:
			"# Stars Rating Example\n\nThis page demonstrates the Stars rating system (1-5 stars).",
		tags: ["sample", "rating", "stars"],
		categoryId: 3, // Documentation category with 's' rating
		createdBy: 1,
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 days ago
		updatedBy: 1,
		updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
		revisions: [
			{
				id: 4,
				pageId: 3,
				revisionId: 1,
				content: "# Stars Rating Example\n\nInitial content.",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
				comment: "Initial version",
			},
			{
				id: 5,
				pageId: 3,
				revisionId: 2,
				content:
					"# Stars Rating Example\n\nThis page demonstrates the Stars rating system (1-5 stars).",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
				comment: "Updated content",
			},
		],
		comments: [
			{
				id: 3,
				content: "Very helpful documentation!",
				createdBy: 2,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
			},
		],
		rating: 4.3, // Average star rating (scale of 1-5)
		votes: {
			1: 5, // User 1 gave 5 stars
			2: 4, // User 2 gave 4 stars
			3: 4, // User 3 gave 4 stars
		},
	},

	// Category 4 - Rating disabled page
	{
		id: 4,
		title: "Rating Disabled Example",
		unixName: "rating-disabled",
		content:
			"# Rating Disabled Example\n\nThis page demonstrates a page in a category with rating disabled.",
		tags: ["sample", "rating", "disabled"],
		categoryId: 4, // Admin category with rating: null
		createdBy: 1,
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12, // 12 days ago
		updatedBy: 1,
		updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 6, // 6 days ago
		revisions: [
			{
				id: 6,
				pageId: 4,
				revisionId: 1,
				content: "# Rating Disabled Example\n\nInitial content.",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
				comment: "Initial version",
			},
			{
				id: 7,
				pageId: 4,
				revisionId: 2,
				content:
					"# Rating Disabled Example\n\nThis page demonstrates a page in a category with rating disabled.",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
				comment: "Updated content",
			},
		],
		comments: [],
		rating: 0, // Rating doesn't apply for this page
		votes: {}, // No votes since rating is disabled
	},
];

export const initialSites: Site[] = [
	{
		id: 1,
		name: "Mock Wiki",
		unixName: "mock-wiki",
		description: "A mock wiki site for testing purposes",
		members: [1, 2, 3],
		admins: [1],
		moderators: [2],
		createdBy: 1,
		createdAt: Date.now() - 1000 * 60 * 60 * 24 * 365, // 1 year ago
		settings: {
			theme: "default",
			allowPublicAccess: true,
			enableDiscussions: true,
		},
	},
];

export const initialCategories: Category[] = [
	{
		id: 1,
		siteId: 1,
		name: "Main",
		description: "Main category",
		rating: "p", // plusOnly rating
	},
	{
		id: 2,
		siteId: 1,
		name: "System",
		description: "System pages",
		rating: "m", // plusMinus rating
	},
	{
		id: 3,
		siteId: 1,
		name: "Documentation",
		description: "Documentation pages",
		rating: "s", // stars rating
	},
	{
		id: 4,
		siteId: 1,
		name: "Admin",
		description: "Admin pages",
		rating: null, // Rating disabled
	},
];

export const initialForums: Forum[] = [
	{
		id: 1,
		title: "General Discussion",
		description: "Forum for general discussion about the wiki",
		categoryId: 1,
		threads: [
			{
				id: 1,
				forumId: 1,
				title: "Welcome to the forum",
				description: "Introductory thread",
				createdBy: 1,
				createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
				updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 25, // 25 days ago
				posts: [
					{
						id: 1,
						threadId: 1,
						title: "Welcome to the forum",
						content: "Welcome to the forum! Please introduce yourself.",
						createdBy: 1,
						createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
						revisions: [],
					},
					{
						id: 2,
						threadId: 1,
						parentId: 1,
						title: "Re: Welcome to the forum",
						content:
							"Hello everyone! I'm looking forward to contributing to this wiki.",
						createdBy: 3,
						createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
						revisions: [],
					},
				],
				isSticky: true,
				isLocked: false,
			},
		],
	},
];

export const initialFiles: File[] = [
	{
		id: 1,
		pageId: 1,
		name: "sample.jpg",
		size: 1024 * 50, // 50 KB
		mimeType: "image/jpeg",
		uploadedBy: 1,
		uploadedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
		comments: "Sample image",
	},
];

export const initialSessions: Session[] = [];
