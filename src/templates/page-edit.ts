// src/templates/page-edit.ts
import type { Page } from "../types";

/**
 * Page edit module templates
 */
export const editFormTemplate = (
	page: Page,
	lockId: number,
	lockSecret: string,
	timeLeft: number,
) => `
<h1>Edit page: ${page.title}</h1>

<div>
    <form id="edit-page-form" onkeypress="return OZONE.utils.disableEnterKey(event);">
        <input type="hidden" name="page_id" value="${page.id}"/>
        <input type="hidden" name="lock_id" value="${lockId}"/>
        <input type="hidden" name="lock_secret" value="${lockSecret}"/>
        <table class="form" style="margin: 0.5em auto 1em 0">
            <tr>
                <td>
                    Page title:
                </td>
                <td>
                    <input class="text" id="edit-page-title" name="title" type="text" value="${page.title}" size="35" maxlength="128" 
                        style="font-weight: bold; font-size: 130%;"/>
                </td>
            </tr>
        </table>
        <div class="wd-editor-toolbar-panel" id="wd-editor-toolbar-panel"></div>
        <div>
            <textarea id="edit-page-textarea" name="source" rows="20" cols="60" style="width: 95%;">${page.content || ""}</textarea>
        </div>
        <div class="change-textarea-size">
            <a href="javascript:;" class="btn btn-default" onclick="WIKIDOT.utils.changeTextareaRowNo('edit-page-textarea',-5);">-</a>
            <a href="javascript:;" class="btn btn-default" onclick="WIKIDOT.utils.changeTextareaRowNo('edit-page-textarea',5);">+</a>
        </div>
        <div class="edit-help-34">
            Help: <a href="http://www.wikidot.com/doc:quick-reference" target="_blank">Wiki syntax quick reference</a> <a href="http://snippets.wikidot.com" target="_blank"> Code snippets</a>
        </div>
    
        <table class="edit-page-bottomtable" style="padding: 2px 0; border: none;">
            <tr>
                <td style="border: none; padding: 0 5px;">
                    <div>
                        Comments:
                        <br/>
                        <textarea id="edit-page-comments" name="comments" rows="2" cols="40" ></textarea>
                    </div>
                    <div class="sub">
                        Maximum 200 characters (<span id="comments-charleft"></span> left)
                    </div>
                </td>
                <td style="border: none; padding: 0 5px;">
                    <div id="lock-info" class="alert alert-info" >
                        While you are editing, other users will not be able to edit this page for up to 15 minutes.<br/>If no additional edits are made, your lock will expire in <strong><span id="lock-timer">${timeLeft}</span></strong> seconds.
                    </div>
                </td>
            </tr>
        </table>
        
        <div class="checkbox do-not-notify">
            <label><input type="checkbox" name="dont_notify_watchers" value="true" />Don't notify watchers</label>
        </div>
        
        <div id="edit-page-captcha"></div>
    
        <div class="buttons alignleft">
            <input type="button" name="cancel" id="edit-cancel-button" class="btn btn-danger" value="Cancel" onclick="WIKIDOT.modules.PageEditModule.listeners.cancelWithDeleteDraftConfirmation(event);"/>
            <input type="button" name="diff" id="edit-diff-button" class="btn btn-default" value="Show changes" onclick="WIKIDOT.modules.PageEditModule.listeners.viewDiff(event);"/>
            <input type="button" name="preview" id="edit-preview-button" class="btn btn-default" value="Preview" onclick="WIKIDOT.modules.PageEditModule.listeners.preview(event);"/>
            <input type="button" name="save-draft" id="edit-save-draft-button" class="btn btn-default" value="Save draft" onclick="WIKIDOT.modules.PageEditModule.listeners.saveDraft(event);"/>
            <input type="button" name="save-continue" id="edit-save-continue-button" class="btn btn-info" value="Save and continue" onclick="WIKIDOT.modules.PageEditModule.listeners.saveAndContinue(event);"/>
            <input type="button" name="save" id="edit-save-button" class="btn btn-primary" value="Save" onclick="WIKIDOT.modules.PageEditModule.listeners.save(event);"/>
        </div>
    </form>
</div>

<div id="view-diff-div"></div>

<div id="preview-message" style="display: none;">
    <div class="preview-message">
        Note: This is just a preview.<br/> If you leave the page without saving, your changes will be lost.
        <br/>
        <a href="javascript:;" onclick="OZONE.visuals.scrollTo('action-area');">Go to editor</a> |
        <a href="javascript:;" onclick="document.getElementById('action-area-top').innerHTML='';">Close this box</a>
    </div>
</div>`;

export const createFormTemplate = (
	title: string,
	wikiPage: string,
	lockId: number,
	lockSecret: string,
	timeLeft: number,
) => `
<h1>Create new page: ${title}</h1>

<div>
    <form id="edit-page-form" onkeypress="return OZONE.utils.disableEnterKey(event);">
        <input type="hidden" name="wiki_page" value="${wikiPage}"/>
        <input type="hidden" name="lock_id" value="${lockId}"/>
        <input type="hidden" name="lock_secret" value="${lockSecret}"/>
        <table class="form" style="margin: 0.5em auto 1em 0">
            <tr>
                <td>
                    Page title:
                </td>
                <td>
                    <input class="text" id="edit-page-title" name="title" type="text" value="${title}" size="35" maxlength="128" 
                        style="font-weight: bold; font-size: 130%;"/>
                </td>
            </tr>
        </table>
        <div class="wd-editor-toolbar-panel" id="wd-editor-toolbar-panel"></div>
        <div>
            <textarea id="edit-page-textarea" name="source" rows="20" cols="60" style="width: 95%;"></textarea>
        </div>
        <div class="change-textarea-size">
            <a href="javascript:;" class="btn btn-default" onclick="WIKIDOT.utils.changeTextareaRowNo('edit-page-textarea',-5);">-</a>
            <a href="javascript:;" class="btn btn-default" onclick="WIKIDOT.utils.changeTextareaRowNo('edit-page-textarea',5);">+</a>
        </div>
        <div class="edit-help-34">
            Help: <a href="http://www.wikidot.com/doc:quick-reference" target="_blank">Wiki syntax quick reference</a> <a href="http://snippets.wikidot.com" target="_blank"> Code snippets</a>
        </div>
    
        <table class="edit-page-bottomtable" style="padding: 2px 0; border: none;">
            <tr>
                <td style="border: none; padding: 0 5px;">
                    <div>
                        Comments:
                        <br/>
                        <textarea id="edit-page-comments" name="comments" rows="2" cols="40" >Initial version</textarea>
                    </div>
                    <div class="sub">
                        Maximum 200 characters (<span id="comments-charleft"></span> left)
                    </div>
                </td>
                <td style="border: none; padding: 0 5px;">
                    <div id="lock-info" class="alert alert-info" >
                        While you are editing, other users will not be able to edit this page for up to 15 minutes.<br/>If no additional edits are made, your lock will expire in <strong><span id="lock-timer">${timeLeft}</span></strong> seconds.
                    </div>
                </td>
            </tr>
        </table>
        
        <div class="checkbox do-not-notify">
            <label><input type="checkbox" name="dont_notify_watchers" value="true" />Don't notify watchers</label>
        </div>
        
        <div id="edit-page-captcha"></div>
    
        <div class="buttons alignleft">
            <input type="button" name="cancel" id="edit-cancel-button" class="btn btn-danger" value="Cancel" onclick="WIKIDOT.modules.PageEditModule.listeners.cancelWithDeleteDraftConfirmation(event);"/>
            <input type="button" name="diff" id="edit-diff-button" class="btn btn-default" value="Show changes" onclick="WIKIDOT.modules.PageEditModule.listeners.viewDiff(event);"/>
            <input type="button" name="preview" id="edit-preview-button" class="btn btn-default" value="Preview" onclick="WIKIDOT.modules.PageEditModule.listeners.preview(event);"/>
            <input type="button" name="save-draft" id="edit-save-draft-button" class="btn btn-default" value="Save draft" onclick="WIKIDOT.modules.PageEditModule.listeners.saveDraft(event);"/>
            <input type="button" name="save-continue" id="edit-save-continue-button" class="btn btn-info" value="Save and continue" onclick="WIKIDOT.modules.PageEditModule.listeners.saveAndContinue(event);"/>
            <input type="button" name="save" id="edit-save-button" class="btn btn-primary" value="Save" onclick="WIKIDOT.modules.PageEditModule.listeners.save(event);"/>
        </div>
    </form>
</div>

<div id="view-diff-div"></div>

<div id="preview-message" style="display: none;">
    <div class="preview-message">
        Note: This is just a preview.<br/> If you leave the page without saving, your changes will be lost.
        <br/>
        <a href="javascript:;" onclick="OZONE.visuals.scrollTo('action-area');">Go to editor</a> |
        <a href="javascript:;" onclick="document.getElementById('action-area-top').innerHTML='';">Close this box</a>
    </div>
</div>`;
