// src/utils/response.ts
import type { ActionResponse, ModuleResponse } from "../types";

// Create a standard action response
export function createActionResponse(
	data: Partial<ActionResponse> = {},
): ActionResponse {
	return {
		status: "ok",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		...data,
	};
}

// Create a standard module response
export function createModuleResponse(
	data: Partial<ModuleResponse> = {},
): ModuleResponse {
	const baseResponse = {
		status: "ok",
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		jsInclude: [],
		cssInclude: [],
		callbackIndex: data.callbackIndex || "0",
	};

	if (data.body) {
		return {
			...baseResponse,
			...data,
		};
	}

	const { body, ...restData } = data;
	return {
		...baseResponse,
		...restData,
	};
}

// Create an error response
export function createErrorResponse(
	message: string,
	status = "not_ok",
	callbackIndex = "0",
): ActionResponse | ModuleResponse {
	return {
		status,
		message,
		CURRENT_TIMESTAMP: Math.floor(Date.now() / 1000),
		jsInclude: [],
		cssInclude: [],
		callbackIndex,
	};
}
