import { PostDBService } from './PostDBService';
import { LensTwoTone } from "@material-ui/icons";
import { Post } from "../classes/interfaces/post";
import { PostHttpService } from "./PostHttpService";




export class PostService {
    private static instance: PostService;
    private httpService: PostHttpService;
    private dbService: PostDBService;

    protected constructor() {
        this.httpService = PostHttpService.getInstance();
        this.dbService = PostDBService.getInstance();
        /*setTimeout(() => {
            this.dbService.insertRead('abcdefg').then(() => {
                this.dbService.getAllReadKeys().then(l => console.log(l));
            });
        }, 3000);*/
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
                thumbnailUrl: !val.thumbnail || val.thumbnail === 'default' ? '' : val.thumbnail,
                thumbnailDims: val.thumbnail_width && val.thumbnail_height ? {
                    width: val.thumbnail_width,
                    height: val.thumbnail_height
                } : null,
                id: val.id,
                subreddit: val.subreddit,
                fullPictureUrl: val.url_overridden_by_dest,
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

    public getReadPosts(): Promise<string[]> {
        return this.dbService.getAllReadKeys();
    }

    public getDismissedPosts(): Promise<string[]> {
        return this.dbService.getDismissedKeys();
    }

    public saveDismissPost(id: string): Promise<any> {
        return this.dbService.saveDismissed(id);
    }

    public saveReadPost(id: string): Promise<any> {
        return this.dbService.saveRead(id);
    }

    public init(): Promise<any> {
        return this.dbService.createDB();
    }
}