import { Constants } from './constants';
import { Action } from "redux";
import { AppState } from "./classes/interfaces/appstate";
import { AppAction } from './classes/interfaces/appaction';

const initialState: AppState = {
    posts: [],
    selectedPost: null,
    fetchingPosts: false,
    currentError: ''
};

export default function(state: AppState = initialState, action: AppAction<any>): AppState {
    switch(action.type) {
        case Constants.ACTIONS.SUCCESS_REQUEST_POSTS:
            return {
                ...state,
                posts: action.payload,
                fetchingPosts: false
            };
        case Constants.ACTIONS.FAIL_REQUEST_POSTS:
            return {
                ...state,
                fetchingPosts: false
            };
        case Constants.ACTIONS.SELECT_POST:
            return {
                ...state,
                selectedPost: state.posts.find(x => x.id === action.payload)
            };
        case Constants.ACTIONS.FETCH_REQUEST_POSTS:
            return {
                ...state,
                fetchingPosts: true
            };
        case Constants.ACTIONS.UPDATE_CURRENT_ERROR:
            return {
                ...state,
                currentError: action.payload
            };
        default:
            return state;
    }
    
}