// src/openapi/schema.ts
import type { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { z } from "zod";

// Base schema
export const baseSchema = {
	openapi: "3.0.0",
	info: {
		title: "Wikidot AJAX Mock Server API",
		version: "1.0.0",
		description: "Mock API for Wikidot AJAX endpoints",
		license: {
			name: "MIT",
		},
	},
	servers: [
		{
			url: "/",
			description: "Current server",
		},
	],
};

// Basic schemas that match the actual function implementations
// Action connector schema
export const ActionParamsSchema = z
	.object({
		action: z
			.string()
			.describe('Action type (e.g., "rating", "watch", "Login")'),
		event: z.string().describe('Event type (e.g., "rate", "watch", "login")'),
	})
	.catchall(
		z.any().describe("Any additional parameters specific to the action/event"),
	);

export const ActionResponseSchema = z.object({
	status: z.string().describe('Status of the response ("ok", "not_ok", etc.)'),
	message: z.string().optional().describe("Response message"),
	CURRENT_TIMESTAMP: z.number().describe("Server timestamp"),
	callbackIndex: z
		.string()
		.optional()
		.describe("Callback index for client-side processing"),
});

// Module connector schema
export const ModuleParamsSchema = z
	.object({
		moduleName: z
			.string()
			.describe(
				'Name of the module to call (e.g., "pagerate/PageRateModule", "Empty")',
			),
		callbackIndex: z
			.string()
			.optional()
			.describe("Callback index for client-side processing"),
	})
	.catchall(
		z.any().describe("Any additional parameters specific to the module"),
	);

export const ModuleResponseSchema = z.object({
	status: z.string().describe('Status of the response ("ok", "not_ok", etc.)'),
	message: z.string().optional().describe("Response message"),
	CURRENT_TIMESTAMP: z.number().describe("Server timestamp"),
	body: z.string().optional().describe("HTML content to be rendered"),
	callbackIndex: z
		.string()
		.optional()
		.describe("Callback index for client-side processing"),
	jsInclude: z
		.array(z.string())
		.optional()
		.describe("JavaScript files to include"),
	cssInclude: z.array(z.string()).optional().describe("CSS files to include"),
});

// Define API components
export const apiComponents = {
	schemas: {
		ActionParams: ActionParamsSchema,
		ActionResponse: ActionResponseSchema,
		ModuleParams: ModuleParamsSchema,
		ModuleResponse: ModuleResponseSchema,
	},
};
