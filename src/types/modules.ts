// src/types/modules.ts
export interface ModuleRequest {
	moduleName: string;
	callbackIndex: string;
	[key: string]: string | number | boolean | null | undefined;
}

export interface ModuleResponse {
	status: "ok" | "not_ok" | "no_permission" | string;
	body?: string;
	title?: string;
	CURRENT_TIMESTAMP: number;
	cssInclude?: string[];
	jsInclude?: string[];
	callbackIndex: string;
	[key: string]:
		| string
		| number
		| boolean
		| null
		| undefined
		| string[]
		| undefined;
}

export type ModuleHandler = (
	params: Record<string, string | number | boolean | null | undefined>,
) => Promise<ModuleResponse>;

export interface ModuleRegistry {
	[moduleName: string]: ModuleHandler;
}
