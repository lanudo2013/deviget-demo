import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../classes/interfaces/appstate";
import { Post } from "../../classes/interfaces/post";
import { PostService } from "../../services/PostService";
import { requestPosts, retrieveDismissedPosts, retrieveReadPosts, saveDismissPost, selectPost } from "../../state/actions";
import { PostUI } from "../post/Post";
import './PostList.scss';

interface PostListProps {
}
export const PostList = function(props: PostListProps) {

  const postService = React.useMemo(() => PostService.getInstance(), []);
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => {
    postService.init().then(() => {
        setReady(true);
    }).catch(() => {
        setReady(true);
    });
  }, [postService]);
  
    const dispatch = useDispatch();
    const posts = useSelector((state: AppState) => state.posts);
    useEffect(() => {
      if (ready) {
        dispatch(requestPosts(0, 25));
        dispatch(retrieveReadPosts());
        dispatch(retrieveDismissedPosts());
      }
    }, [ready]);

    const onDismissed = React.useCallback((p: Post) => {
        dispatch(saveDismissPost(p.id));
    }, []);
    const onPress = React.useCallback((p: Post) => {
      dispatch(selectPost(p));
  }, []);
  
    const currentDate = React.useMemo(() => new Date(), []);
  
    const postsEl = React.useMemo(() => {
      return posts.map(x => <PostUI key={x.id} post={x} currentDate={currentDate} onDismiss={onDismissed} onPress={onPress}></PostUI>);
    }, [currentDate, posts]);

    return <div className="PostListContainer">
        {postsEl}
    </div>;
};