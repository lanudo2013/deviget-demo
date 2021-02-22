import { Action } from "redux";

export interface AppAction<T> extends Action {
    payload: T;
}