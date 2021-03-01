import { DismissData } from "./dismiss-data";
import { Post } from "./post";

export interface AppState {
    posts: Post[];
    selectedPost: Post | undefined | null;
    fetchingPosts: boolean;
    currentError: string;
    dismissData: DismissData | undefined;
    postsRead: string[];
}