import { showSaved } from './actions';
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
    dismissData: undefined,
    savedPosts: [],
    showSaved: false
};

export default function(state: AppState = initialState, action: AppAction<any>): AppState {
    switch(action.type) {
        case Constants.REDUX_ACTIONS.UPDATE_POST_LIST:
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
                selectedPost: state.showSaved ? state.savedPosts.find(x => x.id === action.payload) : state.posts.find(x => x.id === action.payload)
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
        case Constants.REDUX_ACTIONS.UPDATE_SAVED_POSTS:
            return {
                ...state,
                savedPosts: action.payload
            };
        case Constants.REDUX_ACTIONS.SHOW_SAVED_POSTS:
            return {
                ...state,
                showSaved: action.payload
            };
        default:
            return state;
    }
    
}