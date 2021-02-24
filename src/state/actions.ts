import { Action, Dispatch } from 'redux';
import { AppAction } from '../classes/interfaces/appaction';
import { AppState } from '../classes/interfaces/appstate';
import { Post } from '../classes/interfaces/post';
import { ResponseDto } from '../classes/response';
import { PostService } from '../services/PostService';
import { Constants } from './../constants';

const postService = PostService.getInstance();

export const fetchRequestPosts = () => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: null} as AppAction<null>);
export const updateRequestPosts = (list: Post[]) => ({type: Constants.ACTIONS.SUCCESS_REQUEST_POSTS, payload: list} as AppAction<Post[]>);
export const failRequestPosts = (err: Error | ResponseDto<any>) => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: err} as AppAction<Error | ResponseDto<any>>);

export const readPostsList = (v: string[]) => ({type: Constants.ACTIONS.READ_POSTS_IDS, payload: v} as AppAction<string[]>);
export const dismissedPostsList = (v: string[]) => ({type: Constants.ACTIONS.DISMISSED_POSTS_IDS, payload: v} as AppAction<string[]>);

export const selectPost = (v: Post) => ({type: Constants.ACTIONS.SELECT_POST, payload: v.id} as AppAction<string>);
export const updateCurrentError = (v: string) => ({type: Constants.ACTIONS.UPDATE_CURRENT_ERROR, payload: v} as AppAction<string>);

export const requestPosts = (limit: number, reset?: boolean) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        dispatch(fetchRequestPosts());
        const { posts } = getState() as AppState;
        return postService.getPosts(limit, reset).then((list) => {
            dispatch(updateRequestPosts(posts.concat(list)));
        }).catch((err) => {
            dispatch(failRequestPosts(err));
            dispatch(updateCurrentError('Unable to get posts'));
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
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts(posts.filter(x => x.id !== id)));
        }).catch(err => {
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts([...posts]));
            dispatch(updateCurrentError('Unable to dismiss post'));
        });
    };
};

export const saveDismissPosts = (ids: string[]) => {
    return (dispatch: Dispatch, getState: () => AppState) => {
        return postService.saveDismissPosts(ids).then(() => {
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts([]));
        }).catch(err => {
            const { posts } = getState() as AppState;
            dispatch(updateRequestPosts([...posts]));
            dispatch(updateCurrentError('Unable to dismiss posts'));
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
            dispatch(updateCurrentError('Unable to save read post'));
        });
    };
};


