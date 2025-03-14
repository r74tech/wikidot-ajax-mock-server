// src/openapi/module-routes.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { moduleConnector } from "../controllers/module-connector";
import { ModuleParamsSchema, ModuleResponseSchema } from "./schema";

// Create OpenAPI app instance for the module connector
export const moduleOpenAPIRoutes = new OpenAPIHono();

// Define the available module names for documentation
const moduleNameOptions = [
	"edit/PageEditModule",
	"edit/PagePreviewModule",
	"edit/PageEditDiffModule",
	"edit/TemplateSourceModule",
	"history/PageHistoryModule",
	"history/PageDiffModule",
	"history/PageSourceModule",
	"history/PageRevisionListModule",
	"history/PageVersionModule",
	"files/PageFilesModule",
	"files/FileUploadModule",
	"files/FileInformationWinModule",
	"files/FileRenameWinModule",
	"files/FileMoveWinModule",
	"files/manager/FileManagerModule",
	"misc/CookiePolicyPlModule",
	"Empty",
	"DefaultModule",
	"pagetags/PageTagsModule",
	"viewsource/ViewSourceModule",
	"forum/ForumNewThreadModule",
	"forum/ForumViewThreadModule",
	"forum/ForumPreviewPostModule",
	"forum/sub/ForumNewPostFormModule",
	"forum/sub/ForumEditPostFormModule",
	"forum/ForumCommentsModule",
	"forum/ForumCommentsListModule",
	"forum/ForumRecentPostsModule",
	"forum/ForumRecentPostsListModule",
	"watch/PageWatchStatusModule",
	"watch/NotLoggedInModule",
	"pagerate/PageRateModule",
	"pagerate/PageRateWidgetModule",
	"account/AccountInfoModule",
	"account/AccountModule",
	"account/AccountSettingsModule",
	"account/AccountNotificationsListModule",
	"account/AccountNotificationsModule",
	"account/AccountProfileModule",
	"account/AccountWelcomeModule",
	"search/SearchModule",
	"search/SearchAllModule",
	"search/UserSearchModule",
	"login/LoginModule",
	"login/LoginStatusModule",
	"passwordrecovery/PasswordRecoveryModule",
	"backlinks/BacklinksModule",
];

// Common examples for documentation purposes
const exampleRequests = {
	"page-rate": {
		summary: "Get page rating module",
		value: {
			moduleName: "pagerate/PageRateModule",
			pageId: "123456",
			callbackIndex: "0",
		},
	},
	"watch-status": {
		summary: "Get page watch status",
		value: {
			moduleName: "watch/PageWatchStatusModule",
			pageId: "123456",
			callbackIndex: "0",
		},
	},
	empty: {
		summary: "Empty module for account operations",
		value: {
			moduleName: "Empty",
			action: "DashboardProfileAction",
			event: "saveAbout",
			real_name: "Example User",
			callbackIndex: "0",
		},
	},
	forum: {
		summary: "View forum thread",
		value: {
			moduleName: "forum/ForumViewThreadModule",
			threadId: "123456",
			pageNo: "1",
			callbackIndex: "0",
		},
	},
	"edit-page": {
		summary: "Edit page",
		value: {
			moduleName: "edit/PageEditModule",
			pageId: "123456",
			callbackIndex: "0",
		},
	},
};

// Define module connector route
export const moduleConnectorRoute = createRoute({
	method: "post",
	path: "/ajax-module-connector.php",
	request: {
		body: {
			content: {
				"application/x-www-form-urlencoded": {
					schema: ModuleParamsSchema.extend({
						moduleName: z
							.enum(moduleNameOptions as [string, ...string[]])
							.describe("Name of the module to call"),
					}),
					examples: exampleRequests,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: ModuleResponseSchema,
				},
			},
			description: "Successful operation",
		},
		400: {
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						message: z.string(),
						callbackIndex: z.string(),
						CURRENT_TIMESTAMP: z.number().optional(),
					}),
				},
			},
			description: "Bad request",
		},
		404: {
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						message: z.string(),
						callbackIndex: z.string(),
						CURRENT_TIMESTAMP: z.number().optional(),
					}),
				},
			},
			description: "Module not found",
		},
		500: {
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						message: z.string(),
						callbackIndex: z.string(),
						CURRENT_TIMESTAMP: z.number().optional(),
					}),
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Module Connector"],
	summary: "Process Wikidot module requests",
	description:
		'Processes module requests like page rendering, forum listings, and more. Each module type requires different parameters - see the examples for common use cases. The special "Empty" module handles action requests through action/event pairs similar to the action connector.',
});

// Register the route with a sample response for documentation
moduleOpenAPIRoutes.openapi(moduleConnectorRoute, (c) => {
	// For documentation only
	return c.json({
		status: "ok",
		message: "Example response",
		body: "<div>Module response body</div>",
		callbackIndex: "0",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		jsInclude: [],
		cssInclude: [],
	});
});

// Add the actual route handler
moduleOpenAPIRoutes.post("/ajax-module-connector.php", moduleConnector);
