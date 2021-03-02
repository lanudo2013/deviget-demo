import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostType } from '../../classes/enums/post-type';
import { AppState } from '../../classes/interfaces/appstate';
import { PostVideo } from '../../classes/interfaces/post';
import './PostDetail.scss';

interface PostDetailProps {}
export const PostDetail = function (props: PostDetailProps) {
    const post = useSelector((state: AppState) => state.selectedPost);

    const htmlDecode = React.useCallback((input: string) => {
        const e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue || '';
    }, []);

    const getPostBody = React.useCallback(() => {
        if (!post) {
            return null;
        }
        const vData = post.videoData || ({} as PostVideo);
        switch (post.postType) {
            case PostType.IMAGE:
                return (
                    <div className="Body-content">
                        <div className="PostPicture" style={{ backgroundImage: `url(${post.postUrl})` }} />
                    </div>
                );
            case PostType.VIDEO:
                return (
                    <div className="Body-content">
                        <video src={vData.url} className="Video" autoPlay muted={false} controls preload="auto" />
                    </div>
                );
            case PostType.LINK:
                return (
                    <div className="Body-content NotCentered">
                        <a href={post.postUrl} className="Url" target="_blank">
                            {post.postUrl}
                        </a>
                    </div>
                );
            case PostType.SELF:
                return (
                    <div
                        className="Body-content NotCentered HtmlBody"
                        dangerouslySetInnerHTML={{ __html: htmlDecode(post.postHtml) }}
                    ></div>
                );
            case PostType.CONTENT_EMBED:
                return (
                    <div
                        className="Body-content EmbedVideo"
                        dangerouslySetInnerHTML={{ __html: htmlDecode(post.embedContent) }}
                    ></div>
                );
            default:
                return null;
        }
    }, [post, htmlDecode]);
    if (!post) {
        return null;
    }

    const body = getPostBody();
    return (
        <div className="PostDetailContainer">
            <div className="AuthorContainer">
                <span className="Author">{post.author}</span>
            </div>
            <div
                className="InnerContainer"
                style={
                    !body
                        ? { justifyContent: 'center' }
                        : post.postType !== PostType.SELF
                        ? { maxHeight: 'calc(100% - 6em)' }
                        : {}
                }
            >
                <span className="Title" style={!body ? { fontSize: '2.6em' } : {}}>
                    {post.title}
                </span>
                {body ? <div className="Body">{body}</div> : null}
            </div>
        </div>
    );
};
