import { WIKIDOT_COMMON_CSS, WIKIDOT_COMMON_JS } from "../../config/constants";
import { store } from "../../data";
// src/controllers/modules/account.ts
import type { ModuleResponse } from "../../types";
import { WikidotError, createModuleResponse } from "../../utils";

/**
 * Account info module
 */
export async function accountInfoModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const { user_id } = params;
	const callbackIndex = String(params.callbackIndex || "0");

	// For mock purposes, we'll use user_id if provided, otherwise user 1
	const userId = user_id
		? typeof user_id === "number"
			? user_id
			: Number(user_id)
		: 1;

	// Try to get the user
	const user = store.getUser(userId);

	if (!user) {
		throw new WikidotError("User not found", "not_ok");
	}

	const html = `
<div class="account-info-module">
  <h1>${user.screenName}のアカウント情報</h1>
  
  <div class="account-details">
    <div class="user-avatar">
      ${
				user.avatar
					? `<img src="${user.avatar}" alt="${user.screenName}" class="avatar" />`
					: '<div class="no-avatar">No Avatar</div>'
			}
    </div>
    
    <div class="user-info">
      <h3>基本情報</h3>
      <table class="user-details-table">
        <tr>
          <th>ユーザー名:</th>
          <td>${user.name}</td>
        </tr>
        <tr>
          <th>表示名:</th>
          <td>${user.screenName}</td>
        </tr>
        <tr>
          <th>メール:</th>
          <td>${user.email}</td>
        </tr>
        <tr>
          <th>登録日:</th>
          <td>${new Date(user.createdAt).toLocaleDateString("ja-JP")}</td>
        </tr>
        <tr>
          <th>カルマ:</th>
          <td>15</td>
        </tr>
      </table>
    </div>
  </div>
  
  <div class="account-actions">
    <a href="/account/settings" class="btn btn-default">設定</a>
    <a href="/account/activity" class="btn btn-default">活動記録</a>
    <a href="/account/messages" class="btn btn-default">メッセージ</a>
    <a href="/account/watched" class="btn btn-default">ウォッチリスト</a>
  </div>
</div>
`;

	return createModuleResponse({
		body: html,
		title: `${user.screenName}のアカウント情報`,
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/account/AccountInfoModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/account/AccountInfoModule.css`],
	});
}

/**
 * Account settings module
 */
export async function accountSettingsModule(
	params: Record<string, string | number | boolean | null | undefined>,
): Promise<ModuleResponse> {
	const callbackIndex = String(params.callbackIndex || "0");

	// For mock purposes, we'll assume user 1 is logged in
	const user = store.getUser(1);

	if (!user) {
		throw new WikidotError("User not found", "not_ok");
	}

	const html = `
<div class="account-settings-module">
  <h1>アカウント設定</h1>
  
  <form id="account-settings-form">
    <h3>基本情報</h3>
    <div class="form-group">
      <label for="screen-name">表示名:</label>
      <input type="text" id="screen-name" name="screen_name" class="form-control" value="${user.screenName}">
    </div>
    
    <div class="form-group">
      <label for="email">メールアドレス:</label>
      <input type="email" id="email" name="email" class="form-control" value="${user.email}">
    </div>
    
    <h3>パスワード変更</h3>
    <div class="form-group">
      <label for="current-password">現在のパスワード:</label>
      <input type="password" id="current-password" name="current_password" class="form-control">
    </div>
    
    <div class="form-group">
      <label for="new-password">新しいパスワード:</label>
      <input type="password" id="new-password" name="new_password" class="form-control">
    </div>
    
    <div class="form-group">
      <label for="new-password-confirm">新しいパスワード (確認):</label>
      <input type="password" id="new-password-confirm" name="new_password_confirm" class="form-control">
    </div>
    
    <h3>通知設定</h3>
    <div class="form-group checkbox">
      <label>
        <input type="checkbox" name="notify_watched" checked> ウォッチしているページが更新されたときに通知する
      </label>
    </div>
    
    <div class="form-group checkbox">
      <label>
        <input type="checkbox" name="notify_messages" checked> 新規メッセージを受け取ったときに通知する
      </label>
    </div>
    
    <div class="form-group">
      <button type="button" class="btn btn-primary" onclick="WIKIDOT.modules.AccountSettingsModule.listeners.save()">保存</button>
      <button type="button" class="btn btn-default" onclick="WIKIDOT.modules.AccountSettingsModule.listeners.cancel()">キャンセル</button>
    </div>
  </form>
</div>
`;

	return createModuleResponse({
		body: html,
		title: "アカウント設定",
		callbackIndex,
		jsInclude: [`${WIKIDOT_COMMON_JS}/account/AccountSettingsModule.js`],
		cssInclude: [`${WIKIDOT_COMMON_CSS}/account/AccountSettingsModule.css`],
	});
}
