import { Constants } from '../constants';
import { Action } from "redux";
import { AppState } from "../classes/interfaces/appstate";
import { AppAction } from '../classes/interfaces/appaction';

const initialState: AppState = {
    posts: [],
    selectedPost: null,
    fetchingPosts: false,
    currentError: '',
    postsRead: [],
    dismissData: undefined
};

export default function(state: AppState = initialState, action: AppAction<any>): AppState {
    switch(action.type) {
        case Constants.REDUX_ACTIONS.SUCCESS_REQUEST_POSTS:
            return {
                ...state,
                posts: action.payload,
                fetchingPosts: false
            };
        case Constants.REDUX_ACTIONS.FAIL_REQUEST_POSTS:
            return {
                ...state,
                fetchingPosts: false
            };
        case Constants.REDUX_ACTIONS.SELECT_POST:
            return {
                ...state,
                selectedPost: state.posts.find(x => x.id === action.payload)
            };
        case Constants.REDUX_ACTIONS.FETCH_REQUEST_POSTS:
            return {
                ...state,
                fetchingPosts: true
            };
        case Constants.REDUX_ACTIONS.UPDATE_CURRENT_ERROR:
            return {
                ...state,
                currentError: action.payload
            };
        case Constants.REDUX_ACTIONS.READ_POSTS_IDS:
            return {
                ...state,
                postsRead: action.payload
            };
        case Constants.REDUX_ACTIONS.UPDATE_DONE_DISMISS_DATA:
            return {
                ...state,
                dismissData: action.payload
            };
        default:
            return state;
    }
    
}