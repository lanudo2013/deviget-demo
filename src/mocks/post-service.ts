import { removeSavedPost } from './../state/actions';
import { Post } from "../classes/interfaces/post";

export const buildMockedPromise = (resolved: any, rejected?: any) => {
    const o: any = {
        then: (fnResolved: (...args: any[]) => any) => {
            fnResolved(resolved);
            return o;
        },
        catch: (fnRejected?: (...args: any[]) => any) => {
            if (fnRejected && rejected) {
                fnRejected(rejected);
            }
            return o;
        }
    }
    return o;
}

export function createMockedPostServiceObj(): any {
    const readPosts: {[key: string]: any} = {};
    const dismissedPosts: {[key: string]: any}  = {};
    const savedPosts: {[key: string]: Post}  = {};
    const retValue = {
        init: jest.fn().mockImplementation(() => {
            return buildMockedPromise(null);
        }),
        getDismissedPosts: jest.fn().mockImplementation(() => {
            return buildMockedPromise(Object.keys(dismissedPosts));
        }),
        getReadPosts: jest.fn().mockImplementation(() => {
            return buildMockedPromise(Object.keys(readPosts));
        }),
        saveReadPost: jest.fn().mockImplementation((v: string) => {
            readPosts[v] = 1;
            return buildMockedPromise(null);
        }),
        savePost: jest.fn().mockImplementation((p: Post) => {
            savedPosts[p.id] = p;
            return buildMockedPromise(null);
        }),
        removeSavedPost: jest.fn().mockImplementation((v: string) => {
            delete savedPosts[v];
            return buildMockedPromise(null);
        }),
        savePageSize: (v: string) => {
        },
        saveDismissPost: jest.fn().mockImplementation((v: string) => {
            dismissedPosts[v] = 1;
            return buildMockedPromise(null);
        }),
        getPosts: jest.fn().mockImplementation((a: number, b: boolean): Promise<Post[]> => {
            return buildMockedPromise([]);
        }),
        saveDismissPosts: jest.fn().mockImplementation((v: string[]) => {
            Object.keys(v).forEach((x: any) => {
                dismissedPosts[v[x]] = 1;
            });
            return buildMockedPromise(null);
        }),
        getSavedPosts: jest.fn().mockImplementation((): Promise<Post[]> => {
            const result: Post[] = [];
            Object.keys(savedPosts).forEach((x: any) => {
                result.push(savedPosts[x]);
            });
            return buildMockedPromise(result);
        }),
        getPageSize: () => {
            return 25;
        }
    };
    return retValue;
}