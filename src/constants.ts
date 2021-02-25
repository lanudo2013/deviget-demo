export class Constants {
    public static readonly REDDIT_BASE_URL = `https://www.reddit.com/top.json`;
    public static readonly HTTP_TIMEOUT = 20000;
    public static ERRORS = {
        TIMEOUT_CODE: -1
    }

    public static ACTIONS = {
        FETCH_REQUEST_POSTS: 'fetch-request-posts',
        SUCCESS_REQUEST_POSTS: 'success-request-posts',
        FAIL_REQUEST_POSTS: 'fail-request-posts',

        DISMISS_POST: 'dismiss-post',
        SELECT_POST: 'select-post',

        READ_POSTS_IDS: 'read-posts-ids',
        DISMISSED_POSTS_IDS: 'dismissed-posts-ids',
        UPDATE_CURRENT_ERROR: 'update-current-error'
    }

    public static MOBILE_WIDHT_LIMIT_PX = 1200;
}