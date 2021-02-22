export class ResponseDto<T> {
    public data: T;
    public success: boolean;
    public message: string;
    public code: number | undefined;

    public constructor(data: T, success: boolean, message: string, code?: number) {
        this.data = data;
        this.success = success;
        this.message = message;
        this.code = code;
    }
}