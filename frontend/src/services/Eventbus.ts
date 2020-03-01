import Vue from 'vue';

export default class Events {
    public static readonly LOGIN_MODAL_OPEN = 'open login modal';
    public static readonly REGISTER_MODAL_OPEN = 'open register modal';
    public static readonly LOGIN_MODAL_CLOSE = 'close login modal';
    public static readonly REGISTER_MODAL_CLOSE = 'close register modal';
    public static readonly SEARCH_USED = 'search has been used';
    public static readonly COMMENT_REPLY_OPEN = 'a reply has been used';
    public static readonly REFRESH_COMMENTS = 'refresh the comments';
    public static readonly CHECK_UPDATES = 'check for updates';
}

export const EventBus = new Vue();
