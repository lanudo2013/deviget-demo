import { Post } from "./post";

export interface AppState {
    posts: Post[];
    selectedPost: Post | undefined | null;
}