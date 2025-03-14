// src/types/actions.ts
export interface ActionRequest {
	action: string;
	event: string;
	[key: string]: string | number | boolean | null | undefined;
}

export interface ActionResponse {
	status: "ok" | "not_ok" | "no_permission" | string;
	message?: string;
	CURRENT_TIMESTAMP: number;
	[key: string]:
		| string
		| number
		| boolean
		| null
		| undefined
		| Record<string, unknown>;
}

export type ActionHandler = (
	params: Record<string, string | number | boolean | null | undefined>,
) => Promise<ActionResponse>;

export interface ActionRegistry {
	[action: string]: {
		[event: string]: ActionHandler;
	};
}
