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

    public getPosts(after: string | null, limit: number): Promise<any> {
        const params = [limit > 0 ? `limit=${limit}` : null, after ? `after=${after}` : null];

        return Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(
                        new ResponseDto<null>(null, false, Constants.APP_MESSAGES.HTTP_TIMEOUT, Constants.ERRORS.TIMEOUT_CODE)
                    );
                }, this.HTTP_TIMEOUT);
            }),
            fetch(Constants.REDDIT_BASE_URL + '?' + params.filter((x) => x !== null).join('&'))
                .then((res) => res.json())
                .then((response) => {
                    if (response && response.data && response.data.children && response.data.children.length) {
                        return {
                            list: response.data.children.map((x: any) => x.data),
                            after: response.data.after,
                            before: response.data.before
                        };
                    }
                    return {};
                })
        ]);
    }
}
