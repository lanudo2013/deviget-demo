import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../classes/interfaces/appstate";
import './PostDetail.scss';

interface PostDetailProps {
}
export const PostDetail = function(props: PostDetailProps) {
    const dispatch = useDispatch();
    const post = useSelector((state: AppState) => state.selectedPost);
    if (!post) {
        return null;
    }
    return <div className="PostDetailContainer">
        <h1>{post.author}</h1>
        <h2>{post.title}</h2>
    </div>;
};