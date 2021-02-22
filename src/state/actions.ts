import { Action, Dispatch } from 'redux';
import { AppAction } from '../classes/interfaces/appaction';
import { AppState } from '../classes/interfaces/appstate';
import { Post } from '../classes/interfaces/post';
import { ResponseDto } from '../classes/response';
import { PostService } from '../services/PostService';
import { Constants } from './../constants';

const postService = PostService.getInstance();

export const fetchRequestPosts = () => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: null} as AppAction<null>);
export const successRequestPosts = (list: Post[]) => ({type: Constants.ACTIONS.SUCCESS_REQUEST_POSTS, payload: list} as AppAction<Post[]>);
export const failRequestPosts = (err: Error | ResponseDto<any>) => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: err} as AppAction<Error | ResponseDto<any>>);

export const readPostsList = (v: string[]) => ({type: Constants.ACTIONS.READ_POSTS_IDS, payload: v} as AppAction<string[]>);
export const dismissedPostsList = (v: string[]) => ({type: Constants.ACTIONS.DISMISSED_POSTS_IDS, payload: v} as AppAction<string[]>);

export const selectPost = (v: Post) => ({type: Constants.ACTIONS.SELECT_POST, payload: v.id} as AppAction<string>);

export const requestPosts = (page: number, limit: number) => {
    return (dispatch: Dispatch) => {
        dispatch(fetchRequestPosts());
        return postService.getPosts().then((list) => {
            dispatch(successRequestPosts(list));
        }).catch((err) => {
            dispatch(failRequestPosts(err));
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
            dispatch(successRequestPosts(posts.filter(x => x.id !== id)));
        });
    };
};


