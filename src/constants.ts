export class Constants {
    public static readonly REDDIT_BASE_URL = `https://www.reddit.com/top.json`;
    public static readonly HTTP_TIMEOUT = 40000;
    public static ERRORS = {
        TIMEOUT_CODE: -1
    }

    public static REDUX_ACTIONS = {
        FETCH_REQUEST_POSTS: 'fetch-request-posts',
        UPDATE_POST_LIST: 'update-post-list',
        FAIL_REQUEST_POSTS: 'fail-request-posts',

        DISMISS_POST: 'dismiss-post',
        SELECT_POST: 'select-post',

        READ_POSTS_IDS: 'read-posts-ids',
        DISMISSED_POSTS_IDS: 'dismissed-posts-ids',
        UPDATE_CURRENT_ERROR: 'update-current-error',

        UPDATE_DONE_DISMISS_DATA: 'update-done-dismiss-data',
        UPDATE_SAVED_POSTS: 'update-saved-posts',
        SHOW_SAVED_POSTS: 'show-saved-posts'
    }

    public static POST_LIST_PAGE_SIZES = [25, 50, 100];
    public static MOBILE_WIDHT_LIMIT_PX = 1200;

    public static APP_MESSAGES = {
        HTTP_TIMEOUT: 'Connection timeout',
        ERROR_GET_POSTS: 'Unable to get posts',
        REFRESH_BUTTON: 'Refresh',
        DISMISS_ALL_BUTTON: 'Dismiss All',
        ERROR_TITLE: 'Error',
        DISMISS_BUTTON: 'Dismiss',
        SAVE_BUTTON: 'Save',
        REMOVE_BUTTON: 'Remove',
        SAVED_POSTS: 'Saved',
        LOADING: 'Loading',
        ERROR_DISMISS_POST: 'Unable to dismiss post',
        ERROR_DISMISS_POSTS: 'Unable to dismiss posts',
        ERROR_SAVE_READ_POST: "Unable to save read post state",
        ERROR_GET_SAVED_POSTS: "Unable to retrieve saved posts",
        ERROR_SAVE_POST: 'Unable to save post',
        PAGE_SIZE_PLC: "Page Size"

    }
}