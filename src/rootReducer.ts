import { Constants } from './constants';
import { Action } from "redux";
import { AppState } from "./classes/interfaces/appstate";
import { AppAction } from './classes/interfaces/appaction';

const initialState: AppState = {
    posts: [],
    selectedPost: null
};

export default function(state: AppState = initialState, action: AppAction<any>): AppState {
    switch(action.type) {
        case Constants.ACTIONS.SUCCESS_REQUEST_POSTS:
            return {
                ...state,
                posts: action.payload
            };
        case Constants.ACTIONS.SELECT_POST:
            return {
                ...state,
                selectedPost: state.posts.find(x => x.id === action.payload)
            };
        default:
            return state;
    }
    
}