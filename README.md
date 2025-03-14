# Wikidot AJAX Mock Server

A Hono-based mock server for simulating Wikidot's AJAX APIs: `ajax-module-connector.php` and `ajax-action-connector.php`. This server provides mock implementations of many common Wikidot modules and actions.

## Features

- Mock implementation of Wikidot's ajax-module-connector.php
- Mock implementation of Wikidot's ajax-action-connector.php
- Support for various Wikidot modules including:
  - Page editing and viewing
  - File management
  - Forum functionality
  - User accounts
  - Search
  - Page history and more

## Setup

```sh
# Install dependencies
npm install
# or with pnpm
pnpm install

# Start development server
npm run dev
```

## API Endpoints

This server only accepts POST requests to the following endpoints:

- `/ajax-module-connector.php` - Handles module requests
- `/ajax-action-connector.php` - Handles action requests

## Module Connector Usage

Send a POST request with form-urlencoded data to `/ajax-module-connector.php` with the following parameters:

- `moduleName` (required) - The name of the module to load (e.g. `edit/PageEditModule`)
- `callbackIndex` - The callback index for Wikidot's AJAX system
- Other parameters as required by the specific module

Example:

```sh
curl -X POST http://localhost:8787/ajax-module-connector.php \
  -d "moduleName=edit/PageEditModule&callbackIndex=0&pageId=1"
```

### Supported Modules

- `edit/PageEditModule` - Page editing interface
- `edit/PagePreviewModule` - Preview page content
- `history/PageHistoryModule` - View page history
- `history/PageDiffModule` - Compare page revisions
- `history/PageSourceModule` - View page source for a revision
- `history/PageRevisionListModule` - List page revisions
- `files/PageFilesModule` - List files attached to a page
- `files/FileUploadModule` - File upload interface
- `pagetags/PageTagsModule` - Page tags interface
- `viewsource/ViewSourceModule` - View page source
- `forum/*` - Various forum modules
- `account/*` - User account modules
- `search/SearchModule` - Search functionality
- `login/*` - Login and authentication modules
- `watch/*` - Page/thread watching modules

## Action Connector Usage

Send a POST request with form-urlencoded data to `/ajax-action-connector.php` with the following parameters:

- `action` (required) - The action to perform
- `moduleName` - For module-based actions
- `eventName` - For event-based actions
- Other parameters as required by the specific action

## Development

This project is built with:
- Hono - Web framework
- TypeScript - Type safety
- Wrangler - Development server and deployment

## License

MIT
