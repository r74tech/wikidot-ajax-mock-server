// src/controllers/modules/index.ts
import type { ModuleRegistry } from "../../types";
import { wikidotMockData } from "../../utils/mockData";
import { createModuleResponse } from "../../utils/response";
import * as account from "./account";
import * as backlinks from "./backlinks";
import * as files from "./files";
import * as forum from "./forum";
import * as history from "./history";
import * as login from "./login";
import * as misc from "./misc";
import * as pageEdit from "./page-edit";
import * as pagetags from "./pagetags";
import * as search from "./search";
import * as viewsource from "./viewsource";
import * as watch from "./watch";

// Helper function to create a module handler from mock data
const createModuleHandler = (moduleName: string) => {
  return async (
    params: Record<string, string | number | boolean | null | undefined>,
  ) => {
    // Try to get mock response from wikidotMockData
    const mockModule = wikidotMockData.modules[moduleName];

    if (mockModule) {
      console.log(`Using mock data for module: ${moduleName}`);

      // Return a properly formatted ModuleResponse
      return createModuleResponse({
        status: mockModule.status,
        body: mockModule.body,
        errorType: mockModule.errorType,
        message: mockModule.message,
        callbackIndex: String(params.callbackIndex || "0"),
      });
    }

    // If no mock data found, return a default response
    console.log(
      `No mock data for module: ${moduleName}, returning default response`,
    );
    return createModuleResponse({
      status: "ok",
      body: `<div>Mock response for ${moduleName}</div>`,
      callbackIndex: String(params.callbackIndex || "0"),
    });
  };
};

// Register all module handlers
export const moduleHandlers: ModuleRegistry = {
  // Core modules with existing implementation
  "edit/PageEditModule": pageEdit.pageEditModule,
  "edit/PagePreviewModule": pageEdit.pagePreviewModule,
  "history/PageHistoryModule": history.pageHistoryModule,
  "history/PageDiffModule": history.pageDiffModule,
  "history/PageSourceModule": history.pageSourceModule,
  "history/PageRevisionListModule": history.pageRevisionListModule,
  "files/PageFilesModule": files.pageFilesModule,
  "files/FileUploadModule": files.fileUploadModule,
  "files/FileInformationWinModule": files.fileInformationWinModule,
  "files/FileRenameWinModule": files.fileRenameWinModule,
  "files/FileMoveWinModule": files.fileMoveWinModule,
  "misc/CookiePolicyPlModule": misc.cookiePolicyPlModule,
  Empty: misc.emptyModule,
  DefaultModule: misc.defaultModule,
  "pagetags/PageTagsModule": pagetags.pageTagsModule,
  "viewsource/ViewSourceModule": viewsource.viewSourceModule,
  "forum/ForumNewThreadModule": forum.forumNewThreadModule,
  "forum/ForumViewThreadModule": forum.forumViewThreadModule,
  "forum/ForumPreviewPostModule": forum.forumPreviewPostModule,
  "forum/sub/ForumNewPostFormModule": forum.forumNewPostFormModule,
  "forum/sub/ForumEditPostFormModule": forum.forumEditPostFormModule,
  "forum/ForumCommentsModule": forum.forumCommentsModule,
  "forum/ForumCommentsListModule": forum.forumCommentsListModule,
  "forum/ForumRecentPostsModule": forum.forumRecentPostsModule,
  "forum/ForumRecentPostsListModule": forum.forumRecentPostsListModule,
  "watch/PageWatchStatusModule": watch.pageWatchStatusModule,
  "watch/NotLoggedInModule": watch.notLoggedInModule,
  "pagerate/PageRateModule": watch.pageRateModule,
  "pagerate/PageRateWidgetModule": watch.pageRateModule,
  "account/AccountInfoModule": account.accountInfoModule,
  "account/AccountSettingsModule": account.accountSettingsModule,
  "search/SearchModule": search.searchModule,
  "login/LoginModule": login.loginModule,
  "login/LoginStatusModule": login.loginStatusModule,
  "passwordrecovery/PasswordRecoveryModule": login.passwordRecoveryModule,
  "backlinks/BacklinksModule": backlinks.backlinksModule,

  // Additional modules using mock data
  "account/AccountModule": createModuleHandler("account/AccountModule"),
  "account/AccountNotificationsListModule": createModuleHandler(
    "account/AccountNotificationsListModule",
  ),
  "account/AccountNotificationsModule": createModuleHandler(
    "account/AccountNotificationsModule",
  ),
  "account/AccountProfileModule": createModuleHandler(
    "account/AccountProfileModule",
  ),
  "account/AccountWelcomeModule": createModuleHandler(
    "account/AccountWelcomeModule",
  ),
  "files/manager/FileManagerModule": createModuleHandler(
    "files/manager/FileManagerModule",
  ),
  "edit/PageEditDiffModule": createModuleHandler("edit/PageEditDiffModule"),
  "edit/TemplateSourceModule": createModuleHandler("edit/TemplateSourceModule"),
  "history/PageVersionModule": createModuleHandler("history/PageVersionModule"),
  "search/SearchAllModule": createModuleHandler("search/SearchAllModule"),
  "search/UserSearchModule": createModuleHandler("search/UserSearchModule"),
};
