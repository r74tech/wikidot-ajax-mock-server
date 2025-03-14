// src/controllers/actions/index.ts
// src/controllers/actions/index.ts
import type { ActionRegistry } from "../../types";

// Import all action handlers with original WikiDot action names
// import * as AbuseFlagAction from "./AbuseFlagAction";
// import * as AccountAction from "./AccountAction";
// import * as AccountMembershipAction from "./AccountMembershipAction";
// import * as AccountProfileAction from "./AccountProfileAction";
// import * as AccountSettingsAction from "./AccountSettingsAction";
// import * as ContactsAction from "./ContactsAction";
// import * as CreateAccountAction from "./CreateAccountAction";
// import * as CreateAccount2Action from "./CreateAccount2Action";
// import * as FileAction from "./FileAction";
// import * as ForumAction from "./ForumAction";
import * as LoginAction from "./LoginAction";
// import * as Login2Action from "./Login2Action";
// import * as MailFormAction from "./MailFormAction";
// import * as ManageSiteAction from "./ManageSiteAction";
// import * as ManageSiteAbuseAction from "./ManageSiteAbuseAction";
// import * as ManageSiteBackupAction from "./ManageSiteBackupAction";
// import * as ManageSiteBlockAction from "./ManageSiteBlockAction";
// import * as ManageSiteCloneAction from "./ManageSiteCloneAction";
// import * as ManageSiteEmailListsAction from "./ManageSiteEmailListsAction";
// import * as ManageSiteForumAction from "./ManageSiteForumAction";
// import * as ManageSiteMembershipAction from "./ManageSiteMembershipAction";
// import * as ManageSiteOpenIDAction from "./ManageSiteOpenIDAction";
// import * as ManageSuperUserAction from "./ManageSuperUserAction";
// import * as ManageUsersAction from "./ManageUsersAction";
// import * as MembershipApplyAction from "./MembershipApplyAction";
// import * as NewPageHelperAction from "./NewPageHelperAction";
// import * as NewSiteAction from "./NewSiteAction";
// import * as NewWikiWidgetAction from "./NewWikiWidgetAction";
// import * as PageLockAction from "./PageLockAction";
// import * as PasswordRecoveryAction from "./PasswordRecoveryAction";
// import * as PetitionAction from "./PetitionAction";
// import * as PetitionAdminAction from "./PetitionAdminAction";
// import * as PMAction from "./PMAction";
import * as RateAction from "./RateAction";
// import * as SimpleToDoAction from "./SimpleToDoAction";
// import * as UserInvitationAction from "./UserInvitationAction";
// import * as WatchAction from "./WatchAction";
// import * as WikiPageAction from "./WikiPageAction";

// Register all action handlers using original WikiDot action names
export const actionHandlers: ActionRegistry = {
    // AbuseFlagAction,
    // AccountAction,
    // AccountMembershipAction,
    // AccountProfileAction,
    // AccountSettingsAction,
    // ContactsAction,
    // CreateAccountAction,
    // CreateAccount2Action,
    // FileAction,
    // ForumAction,
    LoginAction,
    // Login2Action,
    // MailFormAction,
    // ManageSiteAction,
    // ManageSiteAbuseAction,
    // ManageSiteBackupAction,
    // ManageSiteBlockAction,
    // ManageSiteCloneAction,
    // ManageSiteEmailListsAction,
    // ManageSiteForumAction,
    // ManageSiteMembershipAction,
    // ManageSiteOpenIDAction,
    // ManageSuperUserAction,
    // ManageUsersAction,
    // MembershipApplyAction,
    // NewPageHelperAction,
    // NewSiteAction,
    // NewWikiWidgetAction,
    // PageLockAction,
    // PasswordRecoveryAction,
    // PetitionAction,
    // PetitionAdminAction,
    // PMAction,
    RateAction,
    // SimpleToDoAction,
    // UserInvitationAction,
    // WatchAction,
    // WikiPageAction,
};