// src/controllers/action-connector.ts
import type { Context } from "hono";
import {
	WikidotError,
	createActionResponse,
	createErrorResponse,
	parseFormData,
} from "../utils";
import { wikidotMockData } from "../utils/mockData";
import { actionHandlers } from "./actions";

export async function actionConnector(c: Context): Promise<Response> {
	try {
		const body = await c.req.text();
		const params = parseFormData(body);

		const { action, event } = params;

		if (!action || !event) {
			return c.json(
				createErrorResponse("Missing action or event parameter"),
				400,
			);
		}

		// Check if we have mock data for this action/event
		let mockAction = null;
		try {
			if (
				action &&
				typeof action === "string" &&
				wikidotMockData.actions[action]
			) {
				const actionObj = wikidotMockData.actions[action as string];
				if (event && typeof event === "string" && actionObj[event as string]) {
					mockAction = actionObj[event as string];
				}
			}
		} catch (e) {
			console.error("Error accessing mock data:", e);
		}

		if (mockAction) {
			console.log(`Using mock data for action: ${action}, event: ${event}`);

			// Return a properly formatted response based on mock data
			return c.json(
				createActionResponse({
					status: mockAction.status,
					// No message field in WikidotActionResponse, use status instead
					message: `Mock response for ${action}.${event} (${mockAction.status})`,
				}),
			);
		}

		// If no mock data, use the handler
		let handler = null;
		try {
			if (
				action &&
				typeof action === "string" &&
				actionHandlers[action as string]
			) {
				const handlerObj = actionHandlers[action as string];
				if (event && typeof event === "string" && handlerObj[event as string]) {
					handler = handlerObj[event as string];
				}
			}
		} catch (e) {
			console.error("Error accessing handler:", e);
		}

		if (!handler) {
			console.log(
				`No handler found for action: ${action}, event: ${event}, returning generic response`,
			);
			return c.json(
				createActionResponse({
					status: "ok",
					message: `Mock response for action: ${action}, event: ${event}`,
				}),
			);
		}

		const response = await handler(params);
		return c.json(response);
	} catch (error) {
		if (error instanceof WikidotError) {
			return c.json(createErrorResponse(error.message, error.status), 400);
		}
		console.error("Error in action connector:", error);
		return c.json(createErrorResponse("Internal server error"), 500);
	}
}
