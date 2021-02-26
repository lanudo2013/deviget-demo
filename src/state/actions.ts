import { Action, Dispatch } from 'redux';
import { AppAction } from '../classes/interfaces/appaction';
import { AppState } from '../classes/interfaces/appstate';
import { DismissData } from '../classes/interfaces/dismiss-data';
import { Post } from '../classes/interfaces/post';
import { ResponseDto } from '../classes/response';
import { PostService } from '../services/PostService';
import { Constants } from './../constants';

const postService = PostService.getInstance();

export const fetchRequestPosts = () => ({type: Constants.REDUX_ACTIONS.FETCH_REQUEST_POSTS, payload: null} as AppAction<null>);
export const updateRequestPosts = (list: Post[]) => ({type: Constants.REDUX_ACTIONS.SUCCESS_REQUEST_POSTS, payload: list} as AppAction<Post[]>);
export const failRequestPosts = (err: Error | ResponseDto<any>) => ({type: Constants.REDUX_ACTIONS.FAIL_REQUEST_POSTS, payload: err} as AppAction<Error | ResponseDto<any>>);

export const readPostsList = (v: string[]) => ({type: Constants.REDUX_ACTIONS.READ_POSTS_IDS, payload: v} as AppAction<string[]>);
export const dismissedPostsList = (v: string[]) => ({type: Constants.REDUX_ACTIONS.DISMISSED_POSTS_IDS, payload: v} as AppAction<string[]>);

export const selectPost = (v: Post) => ({type: Constants.REDUX_ACTIONS.SELECT_POST, payload: v.id} as AppAction<string>);
export const updateCurrentError = (v: string) => ({type: Constants.REDUX_ACTIONS.UPDATE_CURRENT_ERROR, payload: v} as AppAction<string>);

export const updateDoneDimissData = (v: DismissData | undefined) => ({type: Constants.REDUX_ACTIONS.UPDATE_DONE_DISMISS_DATA, payload: v} as AppAction<DismissData | undefined>);


export const requestPosts = (limit: number, reset?: boolean) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        dispatch(fetchRequestPosts());
        const { posts } = getState() as AppState;
        return postService.getPosts(limit, reset).then((list) => {
            dispatch(updateRequestPosts(posts.concat(list)));
        }).catch((err: Error | ResponseDto<any>) => {
            dispatch(failRequestPosts(err));
            dispatch(updateCurrentError(err && err.message ? err.message : Constants.APP_MESSAGES.ERROR_GET_POSTS));
        });
    };
};

export const retrieveReadPosts = () => {
    return (dispatch: Dispatch) => {
        return postService.getReadPosts().then((list) => {
            dispatch(readPostsList(list));
        });
    };
};

export const retrieveDismissedPosts = () => {
    return (dispatch: Dispatch) => {
        return postService.getDismissedPosts().then((list) => {
            dispatch(dismissedPostsList(list));
        });
    };
};

export const saveDismissPost = (id: string) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        return postService.saveDismissPost(id).then(() => {
            dispatch(updateDoneDimissData({type: 'fadeOut', id}));
        }).catch(err => {
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_DISMISS_POST));
        });
    };
};

export const saveDismissPosts = (ids: string[]) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        return postService.saveDismissPosts(ids).then(() => {
            dispatch(updateDoneDimissData({type: 'slideOut'}));
        }).catch(err => {
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_DISMISS_POSTS));
        });
    };
};

export const saveReadPost = (id: string) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        return postService.saveReadPost(id).then(() => {
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts([...posts]));
        }).catch(err => {
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts([...posts]));
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_SAVE_READ_POST));
        });
    };
};


