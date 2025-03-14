// src/utils/error.ts
// Custom error class for Wikidot errors
export class WikidotError extends Error {
	status: string;

	constructor(message: string, status = "not_ok") {
		super(message);
		this.name = "WikidotError";
		this.status = status;
	}
}

// Helper to parse form-urlencoded body or multipart form data
export function parseFormData(
	body: string,
): Record<string, string | number | boolean | null | undefined> {
	try {
		// For debugging - log the exact request body
		console.log("Received raw body:", body);

		const result: Record<string, string | number | boolean | null | undefined> =
			{};

		// Handle empty body
		if (!body) {
			console.log("Empty body received");
			return result;
		}

		// Try to parse as URL-encoded form data
		if (body.includes("=")) {
			console.log("Parsing as URL-encoded form data");
			const params = new URLSearchParams(body);
			for (const [key, value] of params.entries()) {
				result[key] = value;
				console.log(`Parsed param: ${key} = ${value}`);
			}

			console.log("Final parsed result:", result);
			return result;
		}

		// If it's not URL-encoded, try to parse as JSON
		try {
			console.log("Trying to parse as JSON");
			const jsonData = JSON.parse(body);
			console.log("Parsed JSON:", jsonData);
			return jsonData;
		} catch (jsonError) {
			console.log("Failed to parse as JSON, treating as raw data");
			// If it's neither URL-encoded nor JSON, return the body as is
			// in a 'data' field
			return { data: body };
		}
	} catch (error) {
		console.error("Form data parsing error:", error);
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}
		throw new WikidotError("Failed to parse form data", "form_errors");
	}
}
