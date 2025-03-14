// src/index.ts - Entry point of the application
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import { moduleConnector } from "./controllers";
import { actionConnector } from "./controllers/action-connector";
import { setupOpenAPIRoutes } from "./openapi";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", secureHeaders());
app.use("*", prettyJSON());
app.use(
	"*",
	cors({
		origin: "*",
		allowMethods: ["GET", "POST", "OPTIONS"], // Allow GET for docs, POST for API endpoints
		allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		exposeHeaders: ["Content-Length"],
		maxAge: 86400,
		credentials: true,
	}),
);

// Setup OpenAPI documentation routes
setupOpenAPIRoutes(app);

// Routes - provide the API endpoints
import { actionOpenAPIRoutes } from "./openapi/action-routes";
import { moduleOpenAPIRoutes } from "./openapi/module-routes";

// Use OpenAPI for documentation but keep original handlers for actual endpoints
app.route("/api/ajax-action-connector.php", actionOpenAPIRoutes);
app.route("/api/ajax-module-connector.php", moduleOpenAPIRoutes);

// Actual endpoints that handle the real requests
app.post("/ajax-action-connector.php", actionConnector);
app.post("/ajax-module-connector.php", moduleConnector);

// Add redirect from root to docs
app.get("/", (c) => {
	return c.redirect("/docs");
});

// Default route handler
app.all("*", (c) => {
	// Allow GET requests to documentation paths
	if (c.req.method === "GET" && c.req.path.startsWith("/docs")) {
		return c.notFound();
	}

	// For API endpoints
	if (c.req.method === "POST") {
		return c.text(
			"Invalid endpoint, see documentation for available endpoints",
			404,
		);
	}

	// For any other methods to API endpoints
	return c.text(
		"This server accepts GET requests to documentation and POST requests to API endpoints",
		405,
	);
});

// Export for Cloudflare Workers
export default app;
