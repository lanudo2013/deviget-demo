import { PostType } from '../../classes/enums/post-type';
import { Post } from '../../classes/interfaces/post';
import { mount, ReactWrapper, shallow } from 'enzyme';
import moment from 'moment';
import React, { useRef } from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import { PostList } from './PostList';
import { Button, MenuItem, Select } from '@material-ui/core';
import { PostService } from '../../services/PostService';
import { Constants } from '../../constants';
import { AppState } from '../../classes/interfaces/appstate';
import { buildMockedPromise, createMockedPostServiceObj } from '../../mocks/post-service';
import { PostUI } from '../post/PostUI';
import { createStore, Store } from 'redux';
import rootReducer from '../../state/rootReducer';

const globalStoreRef = { store: createStore(rootReducer) };
const mockDispatch = jest.fn().mockImplementation((val) => {
    if (typeof val === 'function') {
        return val(mockDispatch, globalStoreRef.store.getState);
    }
    return globalStoreRef.store.dispatch(val);
});
jest.mock('react-redux', () => {
    return {
        useSelector: (fn: (x: AppState) => any) => fn(globalStoreRef.store.getState()),
        useDispatch: () => mockDispatch
    };
});
jest.mock('../../services/PostService', () => {
    let instance: any = null;
    return {
        PostService: {
            getInstance: jest.fn().mockImplementation(() => {
                if (instance) {
                    return instance;
                }
                instance = createMockedPostServiceObj();
                return instance;
            })
        }
    };
});

describe('Post component', () => {
    let root: ReactWrapper;
    let listP: Post[];
    const currentDate = new Date();

    function createPosts(): Post[] {
        return [
            {
                author: 'author1',
                createdTime: moment(currentDate)
                    .add(-4, 'days')
                    .add(-6, 'hours')
                    .add(+new Date().getTimezoneOffset(), 'minutes')
                    .toDate(),
                numberOfComments: 1230,
                id: 'p1',
                postType: PostType.IMAGE,
                thumbnailUrl: '/p1-thumb.jpg',
                title: 'My new post 1',
                subreddit: 'Sub',
                postUrl: '/p1.jpg',
                postHtml: null
            },
            {
                author: 'author1',
                createdTime: moment(currentDate)
                    .add(-10, 'days')
                    .add(+new Date().getTimezoneOffset(), 'minutes')
                    .toDate(),
                numberOfComments: 26,
                id: 'p2',
                postType: PostType.VIDEO,
                thumbnailUrl: '/p2-thumb.jpg',
                title: 'My new post 2',
                subreddit: 'Sub2',
                postUrl: '/p2.jpg',
                postHtml: null,
                videoData: {
                    url: 'http://myurl.com/video.mpg',
                    width: 200,
                    height: 200
                }
            },
            {
                author: 'author2',
                createdTime: moment(currentDate)
                    .add(-2, 'minutes')
                    .add(+new Date().getTimezoneOffset(), 'minutes')
                    .toDate(),
                numberOfComments: 900,
                id: 'p3',
                postType: PostType.LINK,
                thumbnailUrl: undefined,
                title: 'My new post 3',
                subreddit: 'Sub3',
                postUrl: 'http://www.google.com',
                postHtml: null
            }
        ];
    }
    listP = createPosts();
    const postService = PostService.getInstance();
    jest.spyOn(postService, 'getPosts').mockImplementation(
        (l: number, reset: boolean): Promise<Post[]> => {
            return buildMockedPromise(listP);
        }
    );

    function doBasicChecks(node: any) {
        const tree = renderer.create(node).toJSON();
        expect(tree).toMatchSnapshot();

        let domElement: ReactWrapper = root.update().find(PostList).find('div.PostListContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostListContainer > div.PostListBody');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostListBody > div.PostListInnerContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostListBody > div.PostListOptions');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.children().length).toEqual(4);
        domElement = root.find('div.PostListOptions').find(Select);
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
    }

    beforeEach((dn) => {
        listP = createPosts();
        globalStoreRef.store = createStore(rootReducer);
        dn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test('Init component with some posts', () => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });
        doBasicChecks(<PostList />);
        expect(postService.init).toHaveBeenCalled();
        const postsCalls = mockDispatch.mock.calls.filter(
            (x: any) => x[0] && x[0].type && x[0].type === Constants.REDUX_ACTIONS.UPDATE_POST_LIST
        );
        expect(postsCalls.length).toEqual(2);
        expect(postsCalls[0][0].payload).toEqual([]);
        expect(postsCalls[1][0].payload).toEqual(p);
        expect(postService.getPosts).toHaveBeenCalled();
        expect(postService.getReadPosts).toHaveBeenCalled();
        expect(postService.getDismissedPosts).toHaveBeenCalled();

        const domElements = root.update().find(PostUI);
        expect(domElements.length).toEqual(3);
    });

    test('Select one post', (dn) => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const domElements = root.update().find(PostUI);
        expect(domElements.length).toEqual(3);
        const postUi = domElements.at(0).find('div.PostContainer');
        expect(postUi.get(0)).toBeTruthy();
        postUi.simulate('click');
        expect(postService.saveReadPost).toHaveBeenCalled();
        postService.getReadPosts().then((rs) => {
            expect(rs.indexOf(p[0].id) >= 0).toBeTruthy();
            expect(globalStoreRef.store.getState().selectedPost).toHaveProperty('id', p[0].id);
            expect(globalStoreRef.store.getState().postsRead).toContain(p[0].id);
            dn();
        });
    });

    test('Save dismiss one post', (dn) => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const domElements = root.update().find(PostUI);
        expect(domElements.length).toEqual(3);
        const postUi = domElements.at(0).find('div.PostContainer');
        expect(postUi.get(0)).toBeTruthy();
        postUi.find(Button).find('button.DismissButton').simulate('click');
        expect(postService.saveDismissPost).toHaveBeenCalled();
        postService.getDismissedPosts().then((rs) => {
            expect(rs.indexOf(p[0].id) >= 0).toBeTruthy();
            expect(globalStoreRef.store.getState().dismissData).toEqual({ id: p[0].id, type: 'fadeOut' });
            dn();
        });
    });

    test('Select and dismiss same post', (dn) => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const domElements = root.update().find(PostUI);
        expect(domElements.length).toEqual(3);
        const postUi = domElements.at(0).find('div.PostContainer');
        expect(postUi.get(0)).toBeTruthy();
        postUi.simulate('click');
        expect(postUi.get(0)).toBeTruthy();
        postUi.find(Button).find('button.DismissButton').simulate('click');
        expect(postService.saveDismissPost).toHaveBeenCalled();
        setTimeout(() => {
            postService.getDismissedPosts().then((rs) => {
                expect(rs.indexOf(p[0].id) >= 0).toBeTruthy();
                expect(globalStoreRef.store.getState().selectedPost).toBeFalsy();
                dn();
            });
        });
    });

    test('Dismiss all posts', (dn) => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const dismissAllButton = root.update().find('button.DismissAllButton');
        expect(dismissAllButton.get(0)).toBeTruthy();
        dismissAllButton.simulate('click');
        expect(postService.saveDismissPosts).toHaveBeenCalled();
        postService.getDismissedPosts().then((rs) => {
            expect(rs.length).toEqual(3);
            expect(rs.indexOf(p[0].id) >= 0).toBeTruthy();
            expect(rs.indexOf(p[1].id) >= 0).toBeTruthy();
            expect(rs.indexOf(p[2].id) >= 0).toBeTruthy();
            expect(globalStoreRef.store.getState().dismissData).toEqual({ type: 'slideOut' });
            dn();
        });
    });

    test('Scroll to bottom and call reload posts request', (dn) => {
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const postInnerContainer = root.update().find('div.PostListInnerContainer');
        postInnerContainer.simulate('scroll', { target: { scrollHeight: 100, scrollTop: 99, clientHeight: 100 } });
        setTimeout(() => {
            expect(postService.getPosts).toHaveBeenCalledTimes(2);
            dn();
        }, 500);
    });

    test('Save two first posts and show savedx', (dn) => {
        const p = listP;
        root = mount(<PostList />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: globalStoreRef.store
            }
        });

        const domElements = root.update().find(PostUI);
        expect(domElements.length).toEqual(3);
        let postUi = domElements.at(0).find('button.SaveButton');
        expect(postUi.get(0)).toBeTruthy();
        postUi.simulate('click');
        postUi = domElements.at(2).find('button.SaveButton');
        expect(postUi.get(0)).toBeTruthy();
        postUi.simulate('click');
        expect(postService.savePost).toHaveBeenCalledTimes(2);

        setTimeout(() => {
            postService.getSavedPosts().then((rs) => {
                expect(rs).toEqual([p[0], p[2]]);
                expect(globalStoreRef.store.getState().posts).toEqual([p[0], p[1], p[2]]);
                expect(globalStoreRef.store.getState().savedPosts).toEqual([p[0], p[2]]);
                const postButton = root.update().find('div.PostListOptions').find('button.SavedPostsButton');
                expect(postButton.get(0)).toBeTruthy();
                postButton.simulate('click');
                setTimeout(() => {
                    expect(globalStoreRef.store.getState().showSaved).toEqual(true);
                    const domElements1 = root.update().find(PostUI);
                    expect(domElements1.length).toEqual(2);
                    const foundPosts: Post[] = [];
                    domElements1.forEach((el, idx) => {
                        const p = el.getElement().props.post;
                        foundPosts.push(p);
                    });
                    expect(foundPosts).toEqual([p[0], p[2]]);
                    dn();
                }, 1000);
            });
        });
    });
});
