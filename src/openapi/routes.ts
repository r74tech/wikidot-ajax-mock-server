// src/openapi/routes.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import {
	ActionParamsSchema,
	ActionResponseSchema,
	ModuleParamsSchema,
	ModuleResponseSchema,
} from "./schema";

// Create OpenAPI app instance
export const openAPIRoutes = new OpenAPIHono();

// Define action connector route
const actionConnectorRoute = createRoute({
	method: "post",
	path: "/ajax-action-connector.php",
	request: {
		body: {
			content: {
				"application/x-www-form-urlencoded": {
					schema: ActionParamsSchema,
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: ActionResponseSchema,
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
					}),
				},
			},
			description: "Bad request",
		},
		500: {
			content: {
				"application/json": {
					schema: z.object({
						status: z.string(),
						message: z.string(),
					}),
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Action Connector"],
	summary: "Process Wikidot action requests",
	description:
		"Processes action requests like login, rating, page editing, and more",
});

// Define module connector route
const moduleConnectorRoute = createRoute({
	method: "post",
	path: "/ajax-module-connector.php",
	request: {
		body: {
			content: {
				"application/x-www-form-urlencoded": {
					schema: ModuleParamsSchema,
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
					}),
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Module Connector"],
	summary: "Process Wikidot module requests",
	description:
		"Processes module requests like page rendering, forum listings, and more",
});

// Register routes
openAPIRoutes.openapi(actionConnectorRoute, (c) => {
	return c.json({
		status: "ok",
		message: "API documentation example response",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		callbackIndex: "0",
	});
});

openAPIRoutes.openapi(moduleConnectorRoute, (c) => {
	return c.json({
		status: "ok",
		message: "API documentation example response",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		body: "<div>Example module content</div>",
		callbackIndex: "0",
		jsInclude: [],
		cssInclude: [],
	});
});
