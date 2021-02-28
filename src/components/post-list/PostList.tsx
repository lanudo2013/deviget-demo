import { Button, IconButton, InputBase, MenuItem, Select } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../classes/interfaces/appstate";
import { Post } from "../../classes/interfaces/post";
import { PostService } from "../../services/PostService";
import { requestPosts, retrieveDismissedPosts, retrieveReadPosts, saveDismissPost, saveDismissPosts, saveReadPost, selectPost, updateDoneDimissData, updateRequestPosts } from "../../state/actions";
import { PostRef, PostUI } from "../post/PostUI";
import { Util } from '../util';
import { Constants } from '../../constants';
import './PostList.scss';

interface PostListProps {
}
export const PostList = function(props: PostListProps) {

  const postService = React.useMemo(() => PostService.getInstance(), []);
  const [pageSize, setPageSize] = useState<number>(postService.getPageSize() || Constants.POST_LIST_PAGE_SIZES[0]);
  const [ready, setReady] = useState<boolean>(false);
  const [slideAnimating, setSlideAnimating] = useState<boolean>(false);
  const [menuAnimating, setMenuAnimating] = useState<boolean>(false);
  const [menuOpened, setMenuOpened] = useState<boolean | undefined>(undefined);
  const [windowDimensions, setWindowDimensions] = useState(Util.getWindowDimensions());

  useEffect(() => {
    setMenuOpened(true);
    function handleResize() {
      setMenuOpened(undefined);
      setWindowDimensions(Util.getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const dispatch = useDispatch();
  const initFetch = React.useCallback((oSize: number) => {
    postRefsMap.current = {};
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
  const dismissData = useSelector((state: AppState) => state.dismissData);
  const postRefsMap = useRef<{[key: string]: PostRef}>({});

  const runFadeOutAnimation = React.useCallback((postToDismiss: PostRef | undefined) => {
    if (postToDismiss) {
      postToDismiss.fadeOut().then(() => {
        dispatch(updateRequestPosts(posts.filter(x => x.id !== postToDismiss.id)));
        dispatch(updateDoneDimissData(undefined));
        delete postRefsMap.current[postToDismiss.id];
      }).catch(() => {});
    }
  }, [posts, dispatch]);

  const runSlideOutAnimation =React.useCallback(() => {
      let to = 0;
      const promises: Promise<any>[] = [];
      setSlideAnimating(true);
      posts.forEach((x, i) => {
        const postRef = postRefsMap.current[x.id];
        to = Math.min(600, i * 25);
        promises.push(postRef.slideOut(to));
      });

      Promise.all(promises).then(() => {
        dispatch(updateDoneDimissData(undefined));
        dispatch(updateRequestPosts([]));
        postRefsMap.current = {};
        setSlideAnimating(false);
      }).catch(() => {
        setSlideAnimating(false);
      });
  }, [posts, dispatch]);



  useEffect(() => {
    if (posts.length === Object.keys(postRefsMap.current).length && dismissData) {
        if (dismissData.type === 'fadeOut') {
          const postToDismiss = postRefsMap.current[dismissData.id || ''];
          runFadeOutAnimation(postToDismiss);
        } else if (dismissData.type === 'slideOut') {
          runSlideOutAnimation();
        }
    }
  }, [dismissData, runSlideOutAnimation, runFadeOutAnimation, posts]);

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
        const bottomReached = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight * 1.1 && e.target.scrollTop > 0;
        if (bottomReached && !fetchingPosts && !slideAnimating) {
            dispatch(requestPosts(pageSize));
        }
      }, 350), 
    [dispatch, pageSize, fetchingPosts, slideAnimating]);
  
    const postsEl = React.useMemo(() => {
      return posts.map(x => <PostUI key={x.id} post={x} currentDate={new Date()} onPressDismiss={onDismissed} onPress={onPress} ref={r => r && (postRefsMap.current[r.id]=r)}></PostUI>);
    }, [posts]);

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
      if (!slideAnimating) {
        const ids = posts.map(x => x.id);
        dispatch(saveDismissPosts(ids));
      }
  }, [slideAnimating, posts, dispatch]);

    const onAnimSliderEnd = React.useCallback(() => {
      setMenuAnimating(false);
    }, []);

    const openMenu = React.useCallback(() => {
      if (!menuAnimating) {
        setMenuOpened(x => !x);
        setMenuAnimating(true);
      }
    }, [menuAnimating]);

    const pageSizes = React.useMemo(() => {
      return Constants.POST_LIST_PAGE_SIZES.map(x => ( <MenuItem value={x}>{x}</MenuItem>));
    }, []);

    return <div className="PostListContainer">
      <IconButton aria-label="delete" className={'MenuButton '} onClick={openMenu}>
          <MenuIcon fontSize="large" />
      </IconButton>
      <div className={'PostListBody ' +  (windowDimensions.width < Constants.MOBILE_WIDHT_LIMIT_PX && menuOpened !== undefined ? (menuOpened ? 'animate__animated animate__slideInLeft' : 'animate__animated animate__slideOutLeft') : '')} onAnimationEnd={onAnimSliderEnd}>
        <div className="PostListOptions">
          <Select
              value={pageSize}
              className="Option PageSizeDropdown"
              onChange={handleChange}
              input={<InputBase placeholder={Constants.APP_MESSAGES.PAGE_SIZE_PLC} style={{paddingLeft: '12px'}}/>}
            >
              <MenuItem value="">
                <em>{Constants.APP_MESSAGES.PAGE_SIZE_PLC}</em>
              </MenuItem>
              {pageSizes}
            </Select>
            <Button
              variant="contained"
              className="Option ReloadButton"
              onClick={refreshPress}
              endIcon={<RefreshIcon />}
            >
              {Constants.APP_MESSAGES.REFRESH_BUTTON}
            </Button> 
            <Button
              variant="contained"
              className="Option DismissButton"
              onClick={dismissAllPress}
              endIcon={<ClearAllIcon />}
            >
              {Constants.APP_MESSAGES.DISMISS_ALL_BUTTON}
            </Button>

        </div>
        <div className="PostListInnerContainer" style={!postsEl.length ? {border: 'none'} : {}} onScroll={onScroll}>
            {postsEl}
        </div>
      </div>
    </div>
    ;
};