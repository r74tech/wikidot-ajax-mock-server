import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
import {
	loginFormTemplate,
	loginStatusTemplate,
	passwordRecoveryTemplate,
} from "../../templates/login";
// src/controllers/modules/login.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Login module for user authentication
 */
export async function loginModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { origUrl, reset, disableSSL } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	// Generate a CSRF token for the login form
	const csrfToken = Math.random().toString(36).substring(2, 15);

	const html = loginFormTemplate(csrfToken);

	return createModuleResponse({
		body: html,
		title: "Log In",
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/login/LoginModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/login/LoginModule.css`],
	});
}

/**
 * Password recovery module
 */
export async function passwordRecoveryModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	const html = passwordRecoveryTemplate();

	return createModuleResponse({
		body: html,
		title: "Password Recovery",
		callbackIndex,
		jsInclude: [
			`${WIKIDOT_COMMON_JS}/passwordrecovery/PasswordRecoveryModule.js`,
		],
		cssInclude: [
			`${WIKIDOT_COMMON_CSS}/passwordrecovery/PasswordRecoveryModule.css`,
		],
	});
}

/**
 * Login status module that shows current user information
 */
export async function loginStatusModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	// For mock purposes, we'll assume user 1 is logged in
	const user = store.getUser(1);
	const isLoggedIn = Boolean(user);

	let html = "";

	if (isLoggedIn && user) {
		html = loginStatusTemplate(true, user.screenName);
	} else {
		html = loginStatusTemplate(false);
	}

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/login/LoginStatusModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/login/LoginStatusModule.css`],
	});
}
