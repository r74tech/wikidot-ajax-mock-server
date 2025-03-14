// src/controllers/modules/misc.ts
import type { ModuleResponse } from "../../types";
import { createModuleResponse } from "../../utils";

/**
 * Cookie policy module
 */
export async function cookiePolicyPlModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	return createModuleResponse({
		callbackIndex,
	});
}

/**
 * Empty module
 * This is a simple placeholder that returns an empty response
 */
export async function emptyModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	return createModuleResponse({
		body: "",
		callbackIndex,
	});
}

/**
 * Default module
 * This is a default module that returns a simple message
 */
export async function defaultModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	const html = `<div class="default-module">
    <h3>Default Module</h3>
    <p>This is the default module content.</p>
</div>`;

	return createModuleResponse({
		body: html,
		callbackIndex,
	});
}
