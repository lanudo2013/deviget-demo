import { PostType } from "../enums/post-type";

export interface PostVideo {
    width: number;
    height: number;
    url: string;
}
export interface Post {
    title: string;
    thumbnailUrl: string;
    createdTime: Date;
    createdTimeUtc?: number;
    embedContent?: string;
    author: string;
    postType: PostType;
    postHtml: string;
    id: string;
    postUrl: string;
    videoData?: PostVideo;
    subreddit: string;
    thumbnailDims?: {width: number, height: number};
    numberOfComments: number;
}