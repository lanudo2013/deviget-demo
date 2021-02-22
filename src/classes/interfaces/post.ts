export interface Post {
    title: string;
    thumbnailUrl: string;
    createdTime: Date;
    author: string;
    id: string;
    subreddit: string;
    thumbnailDims?: {width: number, height: number};
    numberOfComments: number;
}