import { swaggerUI } from "@hono/swagger-ui";
// src/openapi/index.ts
import type { Hono } from "hono";
import { actionOpenAPIRoutes } from "./action-routes";
import { moduleOpenAPIRoutes } from "./module-routes";
import { openAPIRoutes } from "./routes";
import { apiComponents, baseSchema } from "./schema";

// Create OpenAPI doc
export const openAPIDoc = {
	...baseSchema,
	components: apiComponents,
	paths: {
		...openAPIRoutes.getOpenAPIDocument(baseSchema).paths,
		...actionOpenAPIRoutes.getOpenAPIDocument(baseSchema).paths,
		...moduleOpenAPIRoutes.getOpenAPIDocument(baseSchema).paths,
	},
};

export function setupOpenAPIRoutes(app: Hono): void {
	// Serve Swagger UI
	app.get("/docs/swagger", swaggerUI({ url: "/docs/openapi.json" }));

	// Serve Redoc UI
	app.get("/docs/redoc", async (c) => {
		const redocHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wikidot AJAX Mock Server API - Redoc</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 0;
          }
        </style>
      </head>
      <body>
        <redoc spec-url="/docs/openapi.json"></redoc>
        <script src="https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"></script>
      </body>
    </html>
    `;
		return c.html(redocHTML);
	});

	// Serve OpenAPI spec as JSON
	app.get("/docs/openapi.json", (c) => {
		return c.json(openAPIDoc);
	});

	// Mount the OpenAPI demo routes for testing
	app.route("/api", openAPIRoutes);
	app.route("/api", actionOpenAPIRoutes);
	app.route("/api", moduleOpenAPIRoutes);

	// Add an index page linking to the docs
	app.get("/docs", (c) => {
		const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wikidot AJAX Mock Server API - Documentation</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          a {
            color: #0366d6;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .docs-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }
          .doc-option {
            flex: 1;
            min-width: 250px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .doc-option h2 {
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <h1>Wikidot AJAX Mock Server API Documentation</h1>
        <p>Welcome to the API documentation for the Wikidot AJAX Mock Server.</p>
        
        <div class="docs-container">
          <div class="doc-option">
            <h2>Swagger UI</h2>
            <p>Interactive API documentation with Swagger UI.</p>
            <a href="/docs/swagger">Open Swagger UI</a>
          </div>
          
          <div class="doc-option">
            <h2>ReDoc</h2>
            <p>Clean and elegant API documentation with ReDoc.</p>
            <a href="/docs/redoc">Open ReDoc</a>
          </div>
          
          <div class="doc-option">
            <h2>Raw OpenAPI Spec</h2>
            <p>Raw OpenAPI specification in JSON format.</p>
            <a href="/docs/openapi.json">View OpenAPI JSON</a>
          </div>
        </div>
      </body>
    </html>
    `;
		return c.html(html);
	});
}
