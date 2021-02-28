import { PostType } from '../../classes/enums/post-type';
import { Post } from '../../classes/interfaces/post';
import { mount, ReactWrapper, shallow } from "enzyme";
import moment from 'moment';
import React, { useRef } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux'; 
import { PostDetail } from './PostDetail';
import { AppState } from '../../classes/interfaces/appstate';
import rootReducer from '../../state/rootReducer';
import { createStore } from 'redux';
 
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: () => mockDispatch
}))

describe('Post component', () => {
    let root: any;
    let listP: Post[];
    let currentDate = new Date();

    function doBasicChecks() {
        let domElement: ReactWrapper = root.update().find(PostDetail).find('div.PostDetailContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostDetailContainer > div.AuthorContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();
        domElement = root.find('div.PostDetailContainer > div.InnerContainer');
        expect(domElement.length).toEqual(1);
        expect(domElement.get(0)).toBeTruthy();

    }

    function htmlDecode(input: string){
        var e = document.createElement('textarea');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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
            createdTime: moment(currentDate).add(-2, 'minutes').add(+new Date().getTimezoneOffset(), 'minutes').toDate(),
            numberOfComments: 900,
            id: 'p3',
            postType: PostType.LINK,
            thumbnailUrl: undefined,
            title: 'My new post 3',
            subreddit: 'Sub3',
            postUrl: 'http://www.google.com',
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
            postHtml: `&lt;iframe class="embedly-embed" src="https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fgfycat.com%2Fifr%2Fanotherreddachshund&amp;display_name=Gfycat&amp;url=https%3A%2F%2Fgfycat.com%2Fanotherreddachshund&amp;image=https%3A%2F%2Fthumbs.gfycat.com%2FAnotherRedDachshund-size_restricted.gif&amp;key=ed8fa8699ce04833838e66ce79ba05f1&amp;type=text%2Fhtml&amp;schema=gfycat" width="460" height="574" scrolling="no" title="Gfycat embed" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="true"&gt;&lt;/iframe&gt;`
        }];
    }

    beforeEach((dn) => {
        
        listP = createPosts();

        dn();
    });
 
    test('Show image post detail', () => 
    {
        const p = listP[0];
        (useSelector as any).mockImplementation(() => p);
        
        root = mount(<PostDetail />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: createStore(rootReducer)
            }
        });
        doBasicChecks();
        let domElement: ReactWrapper = root.find('div.PostDetailContainer > div.AuthorContainer');
        expect(domElement.text()).toEqual(p.author);
        domElement = root.find('div.InnerContainer > span.Title');
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.text()).toEqual(p.title);

        domElement = root.find('div.Body > div.Body-content > div.PostPicture');
        expect(domElement.get(0)).toBeTruthy();
        expect((domElement.getDOMNode() as any).style).toHaveProperty('background-image', `url(${p.postUrl})`);

        
    });

    test('Show video post detail', () => 
    {
        const p = listP[1];
        (useSelector as any).mockImplementation(() => p);
        
        root = mount(<PostDetail />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: createStore(rootReducer)
            }
        });
        doBasicChecks();
        let domElement: ReactWrapper = root.find('div.PostDetailContainer > div.AuthorContainer');
        expect(domElement.text()).toEqual(p.author);
        domElement = root.find('div.InnerContainer > span.Title');
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.text()).toEqual(p.title);

        domElement = root.find('div.Body > div.Body-content > video');
        expect(domElement.get(0)).toBeTruthy();
        expect((domElement.getDOMNode() as any)).toHaveProperty('src', p.videoData.url);
    });

    test('Show link post detail', () => 
    {
        const p = listP[2];
        (useSelector as any).mockImplementation(() => p);
        
        root = mount(<PostDetail />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: createStore(rootReducer)
            }
        });
        doBasicChecks();

        const domElement = root.find('div.Body > div.Body-content > a.Url');
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.text()).toEqual(p.postUrl);
    });

    test('Show embbed html post detail', () => 
    {
        const p = listP[3];
        (useSelector as any).mockImplementation(() => p);
        
        root = mount(<PostDetail />, {
            wrappingComponent: Provider,
            wrappingComponentProps: {
                store: createStore(rootReducer)
            }
        });
        doBasicChecks();

        const domElement = root.find('div.Body > div.Body-content.HtmlBody');
        expect(domElement.get(0)).toBeTruthy();
        expect(domElement.getDOMNode().innerHTML.replace(/&amp;/g, '&')).toEqual(htmlDecode(p.postHtml));
    });

});