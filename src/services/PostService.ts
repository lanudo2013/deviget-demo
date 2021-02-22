import { Post } from "../classes/interfaces/post";
import { PostHttpService } from "./PostHttpService";




export class PostService {
    private static instance: PostService;
    private httpService: PostHttpService;

    protected constructor() {
        this.httpService = PostHttpService.getInstance();
    }
    public static getInstance(): PostService {
        if (!this.instance) {
            this.instance = new PostService();
        }
        return this.instance;
    }

    private mapToPost(val: any): Post | null {
        if (val) {
            return {
                author: val.author_fullname,
                title: val.title,
                name: val.name,
                thumbnailUrl: val.thumbnail,
                thumbnailDims: val.thumbnail_width && val.thumbnail_height ? {
                    width: val.thumbnail_width,
                    height: val.thumbnail_height
                } : null,
                id: val.id,
                subreddit: val.subreddit,
                createdTime: new Date(val.created),
                numberOfComments: val.num_comments
            } as Post;
        }
        return null;
    } 

    public getPosts(): Promise<Post[]> {
        return this.httpService.getPosts().then(list => {
            return (list || []).map((x: any) => this.mapToPost(x));
        });
    }

    public dismissPost() {

    }
}