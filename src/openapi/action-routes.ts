// src/openapi/action-routes.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { actionConnector } from "../controllers/action-connector";
import { ActionParamsSchema, ActionResponseSchema } from "./schema";

// Create OpenAPI app instance for the action connector
export const actionOpenAPIRoutes = new OpenAPIHono();

// Common examples for documentation purposes
const exampleRequests = {
	rate: {
		summary: "Rate a page",
		value: {
			action: "rating",
			event: "rate",
			pageId: "123456",
			rating: "1",
			callbackIndex: "0",
		},
	},
	watch: {
		summary: "Watch a page",
		value: {
			action: "watch",
			event: "watch",
			pageId: "123456",
		},
	},
	login: {
		summary: "Log in",
		value: {
			action: "Login",
			event: "login",
			name: "username",
			password: "password",
			rememberme: "1",
		},
	},
	forum: {
		summary: "Create forum post",
		value: {
			action: "forum",
			event: "post",
			threadId: "123456",
			message: "Post content",
		},
	},
	"wiki-page": {
		summary: "Save page changes",
		value: {
			action: "wiki-page",
			event: "savePage",
			pageId: "123456",
			source: "Page content",
			title: "Page Title",
		},
	},
};

// Define action connector route
export const actionConnectorRoute = createRoute({
	method: "post",
	path: "/ajax-action-connector.php",
	request: {
		body: {
			content: {
				"application/x-www-form-urlencoded": {
					schema: ActionParamsSchema,
					examples: exampleRequests,
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
						CURRENT_TIMESTAMP: z.number().optional(),
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
						CURRENT_TIMESTAMP: z.number().optional(),
					}),
				},
			},
			description: "Internal server error",
		},
	},
	tags: ["Action Connector"],
	summary: "Process Wikidot action requests",
	description:
		"Processes action requests like login, rating, page editing, and more. Different actions require different parameters - see the examples for common use cases.",
});

// Register the route with a sample response for documentation
actionOpenAPIRoutes.openapi(actionConnectorRoute, (c) => {
	return c.json({
		status: "ok",
		message: "API documentation example response",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
	});
});

// Add the actual route handler
actionOpenAPIRoutes.post("/ajax-action-connector.php", actionConnector);
