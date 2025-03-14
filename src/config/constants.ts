// src/config/constants.ts

// Wikidot CDN URLs
export const WIKIDOT_STATIC_CDN = "https://d3g0gp89917ko0.cloudfront.net";
export const WIKIDOT_VERSION = "v--4b961b7cc327"; // Wikidotのバージョン識別子
export const WIKIDOT_COMMON_JS = `${WIKIDOT_STATIC_CDN}/${WIKIDOT_VERSION}/common--modules/js`;
export const WIKIDOT_COMMON_CSS = `${WIKIDOT_STATIC_CDN}/${WIKIDOT_VERSION}/common--modules/css`;

// モックサーバーの設定
export const SERVER_CONFIG = {
	// デフォルトのサイト情報
	DEFAULT_SITE: {
		id: 1,
		name: "Mock Wiki",
		unixName: "www",
	},

	// セッション設定
	SESSION: {
		expireTime: 24 * 60 * 60 * 1000, // 24時間
	},
};

// Wikidotのリクエスト情報（WIKIREQUEST変数のモック）
export const createWikiRequest = (pageId?: number, pageName?: string) => ({
	info: {
		pageId: pageId || null,
		pageUnixName: pageName || "",
		requestPageName: pageName || "",
		siteId: SERVER_CONFIG.DEFAULT_SITE.id,
		domain: "www.wikidot.com",
	},
	token: Math.random().toString(36).substring(2, 15),
	autoEdit: false,
	userId: 1, // デフォルトユーザーID
});
