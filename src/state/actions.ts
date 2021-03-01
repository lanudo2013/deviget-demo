import { Action, Dispatch } from 'redux';
import { AppAction } from '../classes/interfaces/appaction';
import { AppState } from '../classes/interfaces/appstate';
import { DismissData } from '../classes/interfaces/dismiss-data';
import { Post } from '../classes/interfaces/post';
import { ResponseDto } from '../classes/response';
import { PostService } from '../services/PostService';
import { Constants } from './../constants';


export const fetchRequestPosts = () => ({type: Constants.REDUX_ACTIONS.FETCH_REQUEST_POSTS, payload: null} as AppAction<null>);
export const updatePostsList = (list: Post[]) => ({type: Constants.REDUX_ACTIONS.UPDATE_POST_LIST, payload: list} as AppAction<Post[]>);
export const updateSavedPostsList = (list: Post[]) => ({type: Constants.REDUX_ACTIONS.UPDATE_SAVED_POSTS, payload: list} as AppAction<Post[]>);
export const failRequestPosts = (err: Error | ResponseDto<any>) => ({type: Constants.REDUX_ACTIONS.FAIL_REQUEST_POSTS, payload: err} as AppAction<Error | ResponseDto<any>>);

export const readPostsList = (v: string[]) => ({type: Constants.REDUX_ACTIONS.READ_POSTS_IDS, payload: v} as AppAction<string[]>);
export const dismissedPostsList = (v: string[]) => ({type: Constants.REDUX_ACTIONS.DISMISSED_POSTS_IDS, payload: v} as AppAction<string[]>);
export const showSaved = (v: boolean) => ({type: Constants.REDUX_ACTIONS.SHOW_SAVED_POSTS, payload: v} as AppAction<boolean>);


export const selectPost = (v: Post) => ({type: Constants.REDUX_ACTIONS.SELECT_POST, payload: v ? v.id : null} as AppAction<string>);
export const updateCurrentError = (v: string) => ({type: Constants.REDUX_ACTIONS.UPDATE_CURRENT_ERROR, payload: v} as AppAction<string>);

export const updateDoneDimissData = (v: DismissData | undefined) => ({type: Constants.REDUX_ACTIONS.UPDATE_DONE_DISMISS_DATA, payload: v} as AppAction<DismissData | undefined>);


export const requestPosts = (limit: number, reset?: boolean) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        dispatch(fetchRequestPosts());
        const { posts } = getState() as AppState;
        const postService = PostService.getInstance();
        return postService.getPosts(limit, reset).then((list) => {
            dispatch(updatePostsList(posts.concat(list)));
        }).catch((err: Error | ResponseDto<any>) => {
            dispatch(failRequestPosts(err));
            dispatch(updateCurrentError(err && err.message ? err.message : Constants.APP_MESSAGES.ERROR_GET_POSTS));
        });
    };
};

export const retrieveReadPosts = () => {
    return (dispatch: Dispatch) => {
        const postService = PostService.getInstance();
        return postService.getReadPosts().then((list) => {
            dispatch(readPostsList(list));
        });
    };
};

export const retrieveDismissedPosts = () => {
    return (dispatch: Dispatch) => {
        const postService = PostService.getInstance();
        return postService.getDismissedPosts().then((list) => {
            dispatch(dismissedPostsList(list));
        });
    };
};

export const saveDismissPost = (id: string) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.saveDismissPost(id).then(() => {
            dispatch(updateDoneDimissData({type: 'fadeOut', id}));
        }).catch(err => {
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_DISMISS_POST));
        });
    };
};

export const saveDismissPosts = (ids: string[]) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.saveDismissPosts(ids).then(() => {
            dispatch(updateDoneDimissData({type: 'slideOut'}));
        }).catch(err => {
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_DISMISS_POSTS));
        });
    };
};

export const saveReadPost = (id: string) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.saveReadPost(id).then(() => {
            const { posts } = getState() as AppState;
            postService.getReadPosts().then((list) => {
                dispatch(readPostsList(list));
            });
            dispatch(updatePostsList([...posts]));
        }).catch(err => {
            const { posts } = getState() as AppState;
            dispatch(updatePostsList([...posts]));
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_SAVE_READ_POST));
        });
    };
};



export const loadSavedPosts = () => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.getSavedPosts().then((ps: Post[]) => {
            dispatch(updateSavedPostsList(ps));
        }).catch((err) => {
            console.error(err);
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_GET_SAVED_POSTS));
        });
    };
};

export const savePost = (p: Post) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.savePost(p).then(() => {
            return postService.getSavedPosts().then((ps: Post[]) => {
                dispatch(updateSavedPostsList(ps));
            });
        }).catch(err => {
            const { savedPosts } = getState() as AppState;
            dispatch(updateSavedPostsList([...savedPosts]));
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_SAVE_READ_POST));
        });
    };
};

export const removeSavedPost = (id: string) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const postService = PostService.getInstance();
        return postService.removeSavedPost(id).then(() => {
            dispatch(updateDoneDimissData({type: 'fadeOut', id}));
        }).catch(() => {
            dispatch(updateCurrentError(Constants.APP_MESSAGES.ERROR_SAVE_READ_POST));
        });
    };
};


