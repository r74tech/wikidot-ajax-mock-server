// src/controllers/module-connector.ts
import type { Context } from "hono";
import {
	WikidotError,
	createErrorResponse,
	createModuleResponse,
	parseFormData,
} from "../utils";
import { moduleHandlers } from "./modules";

export async function moduleConnector(c: Context): Promise<Response> {
	try {
		console.log("== Module Connector Request ==");

		// Log selected headers individually
		console.log("Content-Type:", c.req.header("Content-Type"));
		console.log("Content-Length:", c.req.header("Content-Length"));

		const body = await c.req.text();
		console.log("Raw request body:", body);

		const params = parseFormData(body);
		console.log("Parsed parameters:", params);

		const { moduleName, callbackIndex } = params;
		console.log(`Processing module: ${moduleName}, callback: ${callbackIndex}`);

		if (!moduleName) {
			console.log("Error: Missing moduleName parameter");
			return c.json(
				createErrorResponse(
					"Missing moduleName parameter",
					"not_ok",
					String(callbackIndex || "0"),
				),
				400,
			);
		}

		const handler = moduleHandlers[moduleName as keyof typeof moduleHandlers];

		if (!handler) {
			console.log(`Error: No handler found for module: ${moduleName}`);
			return c.json(
				createModuleResponse({
					status: "not_found",
					message: `No handler found for module: ${moduleName}`,
					callbackIndex: String(callbackIndex || "0"),
				}),
				404,
			);
		}

		console.log(`Executing handler for module: ${moduleName}`);
		const response = await handler(params);
		console.log("Module handler response:", response);
		return c.json(response);
	} catch (error) {
		if (error instanceof WikidotError) {
			console.error(`WikidotError: ${error.message} (${error.status})`);
			return c.json(
				createModuleResponse({
					status: error.status,
					message: error.message,
					callbackIndex: "0",
				}),
				400,
			);
		}
		console.error("Unexpected error in module connector:", error);
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}
		return c.json(
			createModuleResponse({
				status: "not_ok",
				message: "Internal server error",
				callbackIndex: "0",
			}),
			500,
		);
	}
}
