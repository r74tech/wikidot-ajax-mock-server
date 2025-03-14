import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
// src/controllers/modules/files.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Page files module
 */
export async function pageFilesModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	// Try to get the page from store
	const pageId = typeof page_id === "number" ? page_id : Number(page_id);
	const page = store.getPage(pageId);

	if (!page) {
		throw new WikidotError("Page not found", "not_ok");
	}

	const html = `<h1>Files</h1>

\t<p>
\t\tTotal files: 1
\t\t<br/>
\t\tTotal size: 86.28 kB
\t</p>

\t<table class="table table-striped table-hover page-files">
\t\t<thead>
\t\t  <tr>
\t\t\t  <th>File name</th>
\t\t\t  <th>File type</th>
\t\t\t  <th>Size</th>
\t\t\t  <th></th>
\t\t  </tr>
\t\t</thead>

    <tbody>
\t\t\t\t\t<tr id="file-row-9921247">
\t\t\t\t<td>
\t\t\t\t\t<a href="/local--files/start/sample.png">sample.png</a>
\t\t\t\t</td>
\t\t\t\t<td>
\t\t\t\t\t<span title="PNG image data, 530 x 564, 8-bit/color RGBA, non-interlaced">PNG image data</span>
\t\t\t\t</td>
\t\t\t\t<td>
\t\t\t\t\t86.28 kB
\t\t\t\t</td>
\t\t\t\t<td>
          <a href="javascript:;" onclick="WIKIDOT.modules.PageFilesModule.listeners.fileMoreInfo(event, 9921247)" class="btn btn-info btn-sm btn-small"><i class='icon-info'></i> Info</a>
          <a href="javascript:;" onclick="toggleFileOptions(9921247)" class="btn btn-primary btn-sm btn-small"><i class="icon-plus"></i> Options</a>
\t\t\t\t</td>\t\t\t\t
\t\t\t</tr>
\t\t\t\t</tbody>
\t</table>

<div style="text-align: center">

</div>

<div style="margin-top:1em; text-align: center; font-size: 120%;">
<a href="javascript:;" id="show-upload-button" class="btn btn-large btn-lg btn-primary">Upload a file from your computer</a> 
</div>
<div id="file-action-area">
</div>

<div style="display: none" id="file-options-template">
  <a href="javascript:;" onclick="WIKIDOT.modules.PageFilesModule.listeners.renameFile(event)" class="btn btn-default btn-sm btn-small">Rename</a>
  <a href="javascript:;" onclick="WIKIDOT.modules.PageFilesModule.listeners.moveFile(event)" class="btn btn-default btn-sm btn-small">Move</a>
  <a href="javascript:;" onclick="WIKIDOT.modules.PageFilesModule.listeners.deleteFile(event)" class="btn btn-danger btn-sm btn-small">Delete</a>
</div>

<div id="files-page-id" style="display: none">${pageId}</div>`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/files/PageFilesModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/files/PageFilesModule.css`],
	});
}

/**
 * File upload module
 */
export async function fileUploadModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { page_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!page_id) {
		throw new WikidotError("Page ID is required", "not_ok");
	}

	const html = `<h1>Upload a file</h1>

<div class="file-upload-form">
    <form id="file-upload-form" enctype="multipart/form-data">
        <div class="form-group">
            <label for="file-upload">Select file:</label>
            <input type="file" id="file-upload" name="file" class="form-control">
        </div>
        
        <div class="form-group">
            <label for="file-description">Description:</label>
            <textarea id="file-description" name="description" rows="3" class="form-control"></textarea>
        </div>
        
        <div class="form-group">
            <label>Options:</label>
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="overwrite" value="1"> Overwrite if file with the same name exists
                </label>
            </div>
        </div>
        
        <div class="buttons">
            <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.FileUploadModule.listeners.upload()">Upload</button>
            <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.FileUploadModule.listeners.cancel()">Cancel</button>
        </div>
    </form>
</div>

<div class="upload-progress" style="display: none;">
    <h3>Uploading...</h3>
    <div class="progress">
        <div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
    </div>
</div>

<input type="hidden" id="page-id-field" value="${page_id}">`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/files/FileUploadModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/files/FileUploadModule.css`],
	});
}

/**
 * File information window module
 */
export async function fileInformationWinModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { file_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!file_id) {
		throw new WikidotError("File ID is required", "not_ok");
	}

	const html = `<h1>File Information</h1>

<div class="file-info">
    <table class="table">
        <tr>
            <th>File name:</th>
            <td>sample.png</td>
        </tr>
        <tr>
            <th>File type:</th>
            <td>PNG image data, 530 x 564, 8-bit/color RGBA, non-interlaced</td>
        </tr>
        <tr>
            <th>Size:</th>
            <td>86.28 kB</td>
        </tr>
        <tr>
            <th>Upload date:</th>
            <td>2025-03-01 10:00</td>
        </tr>
        <tr>
            <th>Uploaded by:</th>
            <td>Admin User</td>
        </tr>
        <tr>
            <th>Description:</th>
            <td>Sample image for testing</td>
        </tr>
    </table>
</div>

<div class="file-preview">
    <h3>Preview</h3>
    <div class="preview-container">
        <img src="/local--files/start/sample.png" alt="Sample image">
    </div>
</div>

<div class="buttons">
    <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.FileInformationWinModule.listeners.close()">Close</button>
</div>`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/files/FileInformationWinModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/files/FileInformationWinModule.css`],
	});
}

/**
 * File rename window module
 */
export async function fileRenameWinModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { file_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!file_id) {
		throw new WikidotError("File ID is required", "not_ok");
	}

	const html = `<h1>Rename File</h1>

<div class="file-rename-form">
    <form id="file-rename-form">
        <div class="form-group">
            <label for="new-filename">New file name:</label>
            <input type="text" id="new-filename" name="new_filename" class="form-control" value="sample.png">
        </div>
        
        <div class="buttons">
            <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.FileRenameWinModule.listeners.save()">Save</button>
            <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.FileRenameWinModule.listeners.cancel()">Cancel</button>
        </div>
    </form>
</div>

<input type="hidden" id="file-id-field" value="${file_id}">`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/files/FileRenameWinModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/files/FileRenameWinModule.css`],
	});
}

/**
 * File move window module
 */
export async function fileMoveWinModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { file_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	if (!file_id) {
		throw new WikidotError("File ID is required", "not_ok");
	}

	const html = `<h1>Move File</h1>

<div class="file-move-form">
    <form id="file-move-form">
        <div class="form-group">
            <label for="destination-page">Destination page:</label>
            <select id="destination-page" name="destination_page" class="form-control">
                <option value="1">Page 1</option>
                <option value="2">Page 2</option>
                <option value="3">Page 3</option>
            </select>
        </div>
        
        <div class="buttons">
            <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.FileMoveWinModule.listeners.save()">Move</button>
            <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.FileMoveWinModule.listeners.cancel()">Cancel</button>
        </div>
    </form>
</div>

<input type="hidden" id="file-id-field" value="${file_id}">`;

	return createModuleResponse({
		body: html,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/files/FileMoveWinModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/files/FileMoveWinModule.css`],
	});
}
