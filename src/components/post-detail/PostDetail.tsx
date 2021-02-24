import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { PostType } from '../../classes/enums/post-type';
import { AppState } from "../../classes/interfaces/appstate";
import { PostVideo } from '../../classes/interfaces/post';
import './PostDetail.scss';

interface PostDetailProps {
}
export const PostDetail = function(props: PostDetailProps) {
    const dispatch = useDispatch();
    const post = useSelector((state: AppState) => state.selectedPost);

    const htmlDecode = React.useCallback((input: string) => {
        const e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : (e.childNodes[0].nodeValue || '');
    }, []);
    
    const getPostBody = React.useCallback(() => {
        if (!post) {
            return null;
        }
        const vData = post.videoData || {} as PostVideo;
        switch(post.postType) {
            case PostType.IMAGE:
                return <div className="Img-container"><div className="PostPicture" style={{backgroundImage: `url(${post.postUrl})`}}/></div>;
            case PostType.VIDEO:
                return <div className="Img-container"><video src={vData.url} className="Video" autoPlay controls/></div>;
            case PostType.LINK:
                return <div className="Img-container"><a href={post.postUrl} className="Url" target="_blank">{post.postUrl}</a></div>;
            case PostType.SELF:
                return <div className="Img-container" dangerouslySetInnerHTML={{__html: htmlDecode(post.postHtml)}}></div>;
            default:
                return null;
        }
    }, [post]);
    if (!post) {
        return null;
    }

    const body = getPostBody();
    return <div className="PostDetailContainer">
        <span className="Author">{post.author}</span>
        <div className="InnerContainer" style={!body ? {justifyContent: 'center'} : {}}>
            <span className="Title" style={!body ? {fontSize: '2.4em'} : {}}>{post.title}</span>
            {
                body ? <div className="Body">{body}</div> : null
            }
        </div>
       
    </div>;
};