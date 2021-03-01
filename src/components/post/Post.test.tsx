import { fromPostType, PostType } from '../../classes/enums/post-type';
import { Post } from '../../classes/interfaces/post';
import { mount, ReactWrapper } from "enzyme";
import moment from 'moment';
import React, { useRef } from 'react';
import renderer from 'react-test-renderer';
import { PostUI } from './PostUI';
import { Button } from '@material-ui/core';
import { Constants } from '../../constants';

describe('Post component', () => {
    let root: ReactWrapper;
    let listP: Post[];
    let onPressFn: (p: Post) => void;
    let onPressDismissFn: (p: Post) => void;
    let currentDate = new Date();

    function doBasicChecks(node: any) {
        const tree = renderer.create(node).toJSON();
        expect(tree).toMatchSnapshot();

        let domElement: ReactWrapper = root.find('div.PostContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostContainer > div.Header');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostContainer > div.Body');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostContainer > div.Footer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();

    }

    function checkAuthorTitleComments(p: Post, expNumCommentsText: string) {
        let domElement: ReactWrapper;
        domElement = root.find('span.Author');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual(p.author);

        domElement = root.find('span.Title');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual(p.title);

        domElement = root.find('span.CommentsNum');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual(expNumCommentsText);
    }

    function createPosts(): Post[] {
        return [{
            author: 'author1',
            createdTime: moment(currentDate).add(-4, 'days').add(-6, 'hours').add(+new Date().getTimezoneOffset(), 'minutes').toDate(),
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
            createdTime: moment(currentDate).add(-10, 'days').add(+new Date().getTimezoneOffset(), 'minutes').toDate(),
            numberOfComments: 878,
            id: 'p2',
            postType: PostType.IMAGE,
            thumbnailUrl: '/p2-thumb.jpg',
            title: 'My new post 2',
            subreddit: 'Sub2',
            postUrl: '/p2.jpg',
            postHtml: null
        },
        {
            author: 'author2',
            createdTime: moment(currentDate).add(-2, 'minutes').add(+new Date().getTimezoneOffset(), 'minutes').toDate(),
            numberOfComments: 900,
            id: 'p3',
            postType: PostType.LINK,
            thumbnailUrl: undefined,
            title: 'My new post 3',
            subreddit: 'Sub3',
            postUrl: '/p3.jpg',
            postHtml: null
        },
        {
            author: 'author3',
            createdTime: moment(currentDate).add(-12, 'seconds').add(+new Date().getTimezoneOffset(), 'minutes').toDate(),
            numberOfComments: 0,
            id: 'p4',
            postType: PostType.SELF,
            thumbnailUrl: undefined,
            title: 'My new post 4',
            subreddit: 'Sub4',
            postUrl: undefined,
            postHtml: null
        }];
    }

    beforeEach((dn) => {
        listP = createPosts();
        onPressFn = jest.fn();
        onPressDismissFn = jest.fn();
        dn();
    });

    test('Select post type', () => {
        let val = fromPostType({post_hint: 'image'});
        expect(val).toEqual(PostType.IMAGE);
        val = fromPostType({is_video: true});
        expect(val).toEqual(PostType.VIDEO);
        val = fromPostType({});
        expect(val).toEqual(PostType.IMAGE);
        val = fromPostType({selftext_html: '<div></div>'});
        expect(val).toEqual(PostType.SELF);
    });
 
    test('Load normal post', () => 
    {
        const node = <PostUI post={listP[0]} currentDate={currentDate} onPress={onPressFn} onPressDismiss={onPressDismissFn}  read={false}/>;
        root = mount(node);
        doBasicChecks(node);
        checkAuthorTitleComments(listP[0], '1,230 comment/s');

        let domElement = root.find('span.CreatedAt');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual('4 days, 6 hours ago');

        domElement = root.find('div.Body > img.Thumbnail');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.get(0).props.src).toEqual(listP[0].thumbnailUrl);
    });

    test('Load normal post 2', () => 
    {
        const p = listP[1];
        const node = <PostUI post={p} currentDate={currentDate} onPress={onPressFn} onPressDismiss={onPressDismissFn}  read={false}/>;
        root = mount(node);
        doBasicChecks(node);
        checkAuthorTitleComments(p, '878 comment/s');

        let domElement = root.find('span.CreatedAt');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual('10 days ago');

        domElement = root.find('div.Body > img.Thumbnail');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.get(0).props.src).toEqual(p.thumbnailUrl);

        let buttonWrapper: ReactWrapper = root.find(Button);
        buttonWrapper.find('button').simulate('click');
    });

    test('Load post without picture', () => 
    {
        const p = listP[2];
        const node = <PostUI post={p} currentDate={currentDate} onPress={onPressFn} onPressDismiss={onPressDismissFn}  read={false}/>;
        root = mount(node);
        doBasicChecks(node);
        checkAuthorTitleComments(p, '900 comment/s');

        let domElement = root.find('span.CreatedAt');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual('2 minutes ago');

        domElement = root.find('div.Body > img.Thumbnail');
        expect(domElement.get(0)).toBeUndefined();
    });

    test('Press callbacks', () => 
    {
        const p = listP[3];
        const postRef = {current: {fadeOut: null, slideOut: null}} as any;
        const node = <PostUI post={p} currentDate={currentDate} onPress={onPressFn} onPressDismiss={onPressDismissFn} ref={postRef} read={false}/>;
        
        root = mount(node);
        doBasicChecks(node);
        checkAuthorTitleComments(p, 'No comments');

        let domElement = root.find('span.CreatedAt');
        expect(domElement.length).toEqual(1);
        expect(domElement.text()).toEqual('Seconds ago');

        let buttonWrapper: ReactWrapper = root.find(Button);
        buttonWrapper.find('button').simulate('click');

        expect(onPressDismissFn).toHaveBeenCalled();
        expect(postRef.current.fadeOut).toBeTruthy();
        expect(postRef.current.slideOut).toBeTruthy();

        buttonWrapper = root.find('div.PostContainer');
        buttonWrapper.simulate('click');

        expect(onPressFn).toHaveBeenCalled();
    });

    test('not read post to read post', () => {
        const p = listP[3];
        const postRef = {current: {fadeOut: null, slideOut: null}} as any;
        const node = <PostUI post={p} currentDate={currentDate} onPress={onPressFn} onPressDismiss={onPressDismissFn} ref={postRef} read={false}/>;
        
        root = mount(node);
        let domElement = root.find('div.Header > div.Header-left > .ReadIcon');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        root.setProps({read: true});
        domElement = root.find('div.Header > div.Header-left > .ReadIcon');
        expect(domElement.get(0)).toBeUndefined();

    })
});