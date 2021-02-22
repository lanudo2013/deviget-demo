import { ResponseDto } from './../classes/response';
import { Constants } from './../constants';


export class PostHttpService {
    private static instance: PostHttpService;
    private readonly HTTP_TIMEOUT = Constants.HTTP_TIMEOUT;

    public static getInstance(): PostHttpService {
        if (!this.instance) {
            this.instance = new PostHttpService();
        }
        return this.instance;
    }

    public getPosts(): Promise<any> {
        return Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new ResponseDto<null>(null, false, '', Constants.ERRORS.TIMEOUT_CODE));
                }, this.HTTP_TIMEOUT);
            }),
            fetch(Constants.REDDIT_BASE_URL, {
            }).then(res => res.json())
            .then(response => {
                if (response && response.data && response.data.children && response.data.children.length) {
                    return response.data.children.map((x: any) => x.data);
                }
                return [];
            })
        ]);
    }
}