import { PostDBService } from './PostDBService';
import { LensTwoTone } from "@material-ui/icons";
import { Post, PostVideo } from "../classes/interfaces/post";
import { PostHttpService } from "./PostHttpService";
import { fromPostType } from '../classes/enums/post-type';




export class PostService {
    private static instance: PostService;
    private httpService: PostHttpService;
    private dbService: PostDBService;
    private lastAuthorId: string | null = '';

    protected constructor() {
        this.httpService = PostHttpService.getInstance();
        this.dbService = PostDBService.getInstance();
        /*setTimeout(() => {
            this.dbService.getDismissedKeys().then(l => console.log(l));
        }, 3000);*/
    }
    public static getInstance(): PostService {
        if (!this.instance) {
            this.instance = new PostService();
        }
        return this.instance;
    }

    private getVideoData(x: any): PostVideo | null {
        if (x && x.reddit_video) {
            return {
                width: x.reddit_video.width,
                height: x.reddit_video.height,
                url: x.reddit_video.fallback_url,
            };
        }       
        return null;
    }

    private mapToPost(val: any): Post | null {
        if (val) {
            return {
                author: val.author_fullname,
                title: val.title,
                name: val.name,
                thumbnailUrl: !val.thumbnail || val.thumbnail === 'default' || val.thumbnail === 'self' ? '' : val.thumbnail,
                thumbnailDims: val.thumbnail_width && val.thumbnail_height ? {
                    width: val.thumbnail_width,
                    height: val.thumbnail_height
                } : null,
                id: val.id,
                subreddit: val.subreddit,
                postType: fromPostType(val),
                postHtml: val.selftext_html,
                postUrl: val.url_overridden_by_dest,
                createdTime: new Date(val.created_utc * 1000),
                numberOfComments: val.num_comments,
                videoData: val.is_video && val.media ? this.getVideoData(val.media) : null
            } as Post;
        }
        return null;
    } 

    public getPostsAux(limit: number, collected: Post[]): Promise<Post[]> {
        return Promise.all([
            this.dbService.getDismissedKeys(),
            this.httpService.getPosts(this.lastAuthorId, limit)
        ]).then(values => {
            const list = values[1] ? values[1].list : [];
            const after = values[1] ? values[1].after : '';
            const diss = values[0];
            const dissMap = diss.reduce((prev, curr) => {
                prev[curr] = 1;
                return prev;
            }, {} as any);
            const result = (list || []).filter((x: any) => dissMap[x.id] !== 1).map((x: any) => this.mapToPost(x));
            if (result.length) {
                this.lastAuthorId = after;
                localStorage.setItem('lastAuthorId', this.lastAuthorId || '');
                collected = [...collected, ...result];
                if (result.length < limit) {
                    return this.getPostsAux(limit - result.length, collected);
                }
            } else {
                if (after && this.lastAuthorId !== after) {
                    this.lastAuthorId = after;
                    return this.getPostsAux(limit, collected);
                }
            }
            
            
            return collected;
        });
    }

    public getPosts(limit: number, reset: boolean | undefined): Promise<Post[]> {
        if (reset) {
            this.lastAuthorId = null;
        }
        return this.getPostsAux(limit, []);
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

    public saveDismissPosts(list: string[]): Promise<any> {
        return this.dbService.saveDismissPosts(list);
    }

    public saveReadPost(id: string): Promise<any> {
        
        return this.dbService.saveRead(id);
    }

    public savePageSize(n: number) {
        localStorage.setItem('pageSize', n + '');
    }

    public getPageSize(): number | null {
        const val = localStorage.getItem('pageSize');
        if (val) {
            return parseInt(val, 10);
        }
        return null;
    }

    public init(): Promise<any> {
        return this.dbService.createDB();
    }
}