import { Action, Dispatch } from 'redux';
import { AppAction } from '../classes/interfaces/appaction';
import { Post } from '../classes/interfaces/post';
import { ResponseDto } from '../classes/response';
import { PostService } from '../services/PostService';
import { Constants } from './../constants';

export const fetchRequestPosts = () => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: null} as AppAction<null>);
export const successRequestPosts = (list: Post[]) => ({type: Constants.ACTIONS.SUCCESS_REQUEST_POSTS, payload: list} as AppAction<Post[]>);
export const failRequestPosts = (err: Error | ResponseDto<any>) => ({type: Constants.ACTIONS.FETCH_REQUEST_POSTS, payload: err} as AppAction<Error | ResponseDto<any>>);

export const requestPosts = (page: number, limit: number) => {
    const postService = PostService.getInstance();
    return (dispatch: Dispatch) => {
        dispatch(fetchRequestPosts());
        return postService.getPosts().then((list) => {
            dispatch(successRequestPosts(list));
        }).catch((err) => {
            dispatch(failRequestPosts(err));
        });
    };
};