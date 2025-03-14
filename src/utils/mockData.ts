// src/utils/mockData.ts
import { generateWikidotToken } from "./token";

// Types for the Wikidot AJAX module mock data
export interface WikidotModuleResponse {
	status: string;
	timestamp: string;
	request: {
		module: string;
		parameters: Record<string, string | number | boolean | null | undefined>;
	};
	body?: string;
	errorType?: string;
	message?: string;
}

export interface WikidotActionResponse {
	status: string;
	timestamp: string;
	request: Record<
		string,
		| string
		| number
		| boolean
		| null
		| undefined
		| Record<string, string | number | boolean | null | undefined>
	>;
}

export interface WikidotMockData {
	summary: {
		timestamp: string;
		totalModules: number;
		totalActions: number;
		errorTypes: Record<string, number>;
	};
	modules: Record<string, WikidotModuleResponse>;
	actions: Record<string, Record<string, WikidotActionResponse>>;
}

// Basic WikidotMockData structure with minimal data
export const wikidotMockData: WikidotMockData = {
	summary: {
		timestamp: new Date().toISOString(),
		totalModules: 0,
		totalActions: 0,
		errorTypes: {},
	},
	modules: {},
	actions: {},
};

// Helper function to create mock module response
export function createMockModuleResponse(
	module: string,
	status = "ok",
	errorType?: string,
	message?: string,
	body?: string,
): WikidotModuleResponse {
	return {
		status: status,
		timestamp: new Date().toISOString(),
		request: {
			module: module,
			parameters: {
				moduleName: module,
				callbackIndex: 0,
				wikidot_token7: generateWikidotToken(),
			},
		},
		...(body && { body }),
		...(errorType && { errorType }),
		...(message && { message }),
	};
}

// Helper function to create mock action response
export function createMockActionResponse(
	action: string,
	event: string,
	status = "ok",
): WikidotActionResponse {
	return {
		status: status,
		timestamp: new Date().toISOString(),
		request: {
			action: action,
			event: event,
			parameters: {
				action: action,
				event: event,
				moduleName: "Empty",
				callbackIndex: 0,
				wikidot_token7: generateWikidotToken(),
			},
		},
	};
}
