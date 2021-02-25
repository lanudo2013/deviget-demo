import { Button, IconButton, InputBase, MenuItem, Select } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../classes/interfaces/appstate";
import { Post } from "../../classes/interfaces/post";
import { PostService } from "../../services/PostService";
import { requestPosts, retrieveDismissedPosts, retrieveReadPosts, saveDismissPost, saveDismissPosts, saveReadPost, selectPost, updateRequestPosts } from "../../state/actions";
import { PostUI } from "../post/Post";
import { Util } from '../util';
import { Constants } from '../../constants';
import './PostList.scss';

interface PostListProps {
}
export const PostList = function(props: PostListProps) {

  const postService = React.useMemo(() => PostService.getInstance(), []);
  const [pageSize, setPageSize] = useState<number>(postService.getPageSize() || 25);
  const [ready, setReady] = useState<boolean>(false);
  const [menuOpened, setMenuOpened] = useState<boolean | undefined>(undefined);
  const [windowDimensions, setWindowDimensions] = useState(Util.getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setMenuOpened(undefined);
      setWindowDimensions(Util.getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const dispatch = useDispatch();
  const initFetch = React.useCallback((oSize: number) => {
    dispatch(updateRequestPosts([]));
    dispatch(requestPosts(oSize, true));
    dispatch(retrieveReadPosts());
    dispatch(retrieveDismissedPosts()); 
  }, [dispatch]);

  useEffect(() => {
    if (!ready) {
      postService.init().then(() => {
          setReady(true);
          initFetch(pageSize);
      }).catch(() => {
          setReady(true);
          initFetch(pageSize);
      });
    }
  }, [postService, dispatch]); 
   
    
  const posts = useSelector((state: AppState) => state.posts);
  const fetchingPosts = useSelector((state: AppState) => state.fetchingPosts);

  const onDismissed = React.useCallback((p: Post) => {
      dispatch(saveDismissPost(p.id));
  }, [dispatch]);
  const onPress = React.useCallback((p: Post) => {
      dispatch(saveReadPost(p.id));
      dispatch(selectPost(p));
      if (windowDimensions.width < Constants.MOBILE_WIDHT_LIMIT_PX) {
        setMenuOpened(false);
      }
      
  }, [dispatch, windowDimensions]);

    const onScroll = React.useCallback(
      debounce((e: any) => {
        const bottomReached = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight * 1.1;
        if (bottomReached && !fetchingPosts) {
            dispatch(requestPosts(pageSize));
        }
      }, 340), 
    [dispatch, pageSize, fetchingPosts]);
  
    const currentDate = React.useMemo(() => new Date(), []);
  
    const postsEl = React.useMemo(() => {
      return posts.map(x => <PostUI key={x.id} post={x} currentDate={currentDate} onDismiss={onDismissed} onPress={onPress}></PostUI>);
    }, [currentDate, posts]);

    const handleChange = React.useCallback((ev: any) => {
        if (ev && ev.target && ev.target.value) {
            setPageSize(ev.target.value);
            postService.savePageSize(ev.target.value);
            initFetch(ev.target.value);
         }
        
    }, [initFetch, postService]);

    const refreshPress = React.useCallback((ev: any) => {
        initFetch(pageSize);
    }, [initFetch, pageSize]);

    const dismissAllPress = React.useCallback((ev: any) => {
      const ids = posts.map(x => x.id);
      dispatch(saveDismissPosts(ids));
  }, [initFetch, posts, dispatch]);

    const openMenu = React.useCallback(() => {
      setMenuOpened(x => !x);
    }, []);

    return <div className="PostListContainer">
      <IconButton aria-label="delete" className={'MenuButton '} onClick={openMenu}>
          <MenuIcon fontSize="large" />
      </IconButton>
      <div className={'PostListBody ' +  (windowDimensions.width < Constants.MOBILE_WIDHT_LIMIT_PX && menuOpened !== undefined ? (menuOpened ? 'animate__animated animate__slideInLeft' : 'animate__animated animate__slideOutLeft') : '')}>
        <div className="PostListOptions">
          <Select
              value={pageSize}
              className="Option PageSizeDropdown"
              onChange={handleChange}
              input={<InputBase placeholder="Page size" style={{paddingLeft: '12px'}}/>}
            >
              <MenuItem value="">
                <em>Page size</em>
              </MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
            <Button
              variant="contained"
              className="Option ReloadButton"
              onClick={refreshPress}
              endIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              className="Option DismissButton"
              onClick={dismissAllPress}
              endIcon={<ClearAllIcon />}
            >
              Dismiss All
            </Button>

        </div>
        <div className="PostListInnerContainer" style={!postsEl.length ? {border: 'none'} : {}} onScroll={onScroll}>
            {postsEl}
        </div>
      </div>
    </div>
    ;
};