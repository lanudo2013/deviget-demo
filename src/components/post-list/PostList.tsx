import { Button, IconButton, InputBase, MenuItem, Select } from '@material-ui/core';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import RefreshIcon from '@material-ui/icons/Refresh';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../classes/interfaces/appstate";
import { Post } from "../../classes/interfaces/post";
import { PostService } from "../../services/PostService";
import { loadSavedPosts, removeSavedPost, requestPosts, retrieveDismissedPosts, retrieveReadPosts, saveDismissPost, saveDismissPosts, savePost, saveReadPost, selectPost, updateDoneDimissData, updatePostsList, updateSavedPostsList, showSaved as showSavedAction } from "../../state/actions";
import { PostRef, PostUI } from "../post/PostUI";
import { Util } from '../util';
import { Constants } from '../../constants';
import './PostList.scss';

interface PostListProps {
}
export const PostList = function(props: PostListProps) {

  const postService = React.useMemo(() => {
    return PostService.getInstance();
  }, []);
  
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
  const postsRead = useSelector((state: AppState) => state.postsRead);
  const selectedPost = useSelector((state: AppState) => state.selectedPost);
  const showSaved = useSelector((state: AppState) => state.showSaved);
  const initFetch = React.useCallback((oSize: number) => {
    postRefsMap.current = {};
    dispatch(updatePostsList([]));
    dispatch(requestPosts(oSize, true));
    dispatch(retrieveReadPosts());
    dispatch(retrieveDismissedPosts()); 
    dispatch(loadSavedPosts());
    dispatch(showSavedAction(false)); 
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
  const savedPosts = useSelector((state: AppState) => state.savedPosts);
  const fetchingPosts = useSelector((state: AppState) => state.fetchingPosts);
  const dismissData = useSelector((state: AppState) => state.dismissData);
  const postRefsMap = useRef<{[key: string]: PostRef}>({});

  const runDismissFadeOutAnimation = React.useCallback((postToDismiss: PostRef | undefined) => {
    if (postToDismiss) {
      postToDismiss.fadeOut().then(() => {
        dispatch(updatePostsList(posts.filter(x => x.id !== postToDismiss.id)));
        dispatch(updateDoneDimissData(undefined));
        delete postRefsMap.current[postToDismiss.id];
      }).catch(() => {});
    }
  }, [posts, dispatch]);

  const runRemoveFadeOutAnimation = React.useCallback((postToDismiss: PostRef | undefined) => {
    if (postToDismiss) {
      postToDismiss.fadeOut().then(() => {
        dispatch(updateSavedPostsList(savedPosts.filter(x => x.id !== postToDismiss.id)));
        dispatch(updateDoneDimissData(undefined));
        delete postRefsMap.current[postToDismiss.id];
      }).catch(() => {});
    }
  }, [savedPosts, dispatch]);

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
        dispatch(updatePostsList([]));
        postRefsMap.current = {};
        setSlideAnimating(false);
      }).catch(() => {
        setSlideAnimating(false);
      });
  }, [posts, dispatch]);
  const [_, setRandom] = useState<number>(0);


  useEffect(() => {
    let list =  posts;
    if (showSaved) {
      list = savedPosts;
    }
    if (list.length === Object.keys(postRefsMap.current).length && dismissData) {
        if (dismissData.type === 'fadeOut') {
          if (selectedPost && selectedPost.id === dismissData.id) {
            dispatch(selectPost(null));
          }
          
          const postToDismiss = postRefsMap.current[dismissData.id || ''];
          if (showSaved) {
            runRemoveFadeOutAnimation(postToDismiss);
          } else {
            runDismissFadeOutAnimation(postToDismiss);
          }
        } else if (dismissData.type === 'slideOut') {
           dispatch(selectPost(null));
          runSlideOutAnimation();
        }
    }
  }, [dismissData, runSlideOutAnimation, runRemoveFadeOutAnimation, runDismissFadeOutAnimation, posts, showSaved, selectedPost]);

  const onPress = React.useCallback((p: Post) => {
      dispatch(saveReadPost(p.id));
      dispatch(selectPost(p));
      if (windowDimensions.width < Constants.MOBILE_WIDHT_LIMIT_PX) {
        setMenuOpened(false);
      }
      
  }, [dispatch, windowDimensions]);

  const onPressSave = React.useCallback((p: Post) => {
    dispatch(savePost(p));    
}, [dispatch, windowDimensions]);

    const onScroll = React.useCallback(
      debounce((e: any) => {
        const bottomReached = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight * 1.1 && e.target.scrollTop > 0;
        if (bottomReached && !fetchingPosts && !slideAnimating && !showSaved) {
            dispatch(requestPosts(pageSize));
        }
      }, 350), 
    [dispatch, pageSize, fetchingPosts, slideAnimating, showSaved]);

    const postsReadMap = React.useMemo(() => {
      return postsRead.reduce((prev, current: string) => {
          (prev as any)[current] = 1;
          return prev;
      }, {} as {[key: string]: string});
    }, [postsRead]);

    const postsSavedMap = React.useMemo(() => {
      return savedPosts.reduce((prev, current: Post) => {
          (prev as any)[current.id] = 1;
          return prev;
      }, {} as {[key: string]: string});
    }, [savedPosts]);

    const onDismissed = React.useCallback((p: Post) => {
      dispatch(saveDismissPost(p.id));
  }, [dispatch]);

   const setPostRef = React.useCallback((rs: any, id: string) => {
     if (rs) {
        postRefsMap.current[id]=rs;
     } else {
        delete postRefsMap.current[id];
     }
   }, []);

    const onRemoveSaved = React.useCallback((p: Post) => {
        dispatch(removeSavedPost(p.id));
    }, [dispatch]);
  
    const postsEl = React.useMemo(() => {
      let list: Post[] = posts;
      if (showSaved) {
        list = savedPosts;
      }
      return list.map(x => <PostUI key={x.id} post={x} currentDate={new Date()} saved={postsSavedMap[x.id] !== undefined} read={postsReadMap[x.id] !== undefined} 
                          canRemove={showSaved && postsSavedMap[x.id] !== undefined}
                          onPressRemoved={onRemoveSaved} onPressDismiss={onDismissed} onPress={onPress} 
                          onPressSave={onPressSave} ref={(r) => setPostRef(r, x.id)}></PostUI>);
    }, [posts, postsReadMap, showSaved, savedPosts, postsSavedMap]);

    const handleChange = React.useCallback((ev: any) => {
        if (ev && ev.target && ev.target.value) {
            dispatch(showSavedAction(false));
            setPageSize(ev.target.value);
            postService.savePageSize(ev.target.value);
            initFetch(ev.target.value);
         }
        
    }, [initFetch, postService, dispatch]);

    const refreshPress = React.useCallback((ev: any) => {
        dispatch(showSavedAction(false));
        initFetch(pageSize);
    }, [initFetch, pageSize, dispatch]);

    const dismissAllPress = React.useCallback((ev: any) => {
        if (!slideAnimating) {
          dispatch(showSavedAction(false));
          const ids = posts.map(x => x.id);
          dispatch(saveDismissPosts(ids));
        }
    }, [slideAnimating, posts, dispatch]);

    const showSavedPress= React.useCallback((ev: any) => {
      if (!slideAnimating) {
          if (!showSaved) {
            postRefsMap.current = {};
            dispatch(showSavedAction(true));
            dispatch(loadSavedPosts());
            setRandom(Math.random());
          } else {
            postRefsMap.current = {};
            dispatch(showSavedAction(false));
          }
          
        }
    }, [slideAnimating, posts, dispatch, showSaved]);

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
      return Constants.POST_LIST_PAGE_SIZES.map(x => ( <MenuItem value={x} key={x}>{x}</MenuItem>));
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
            {
              !showSaved ? 
                <Button
                  variant="contained"
                  className="Option DismissAllButton"
                  onClick={dismissAllPress}
                  endIcon={<ClearAllIcon />}
                >
                  {Constants.APP_MESSAGES.DISMISS_ALL_BUTTON}
                </Button> : null
            }
            
            <Button
              variant="contained"
              className={'Option SavedPostsButton ' + (showSaved ? 'SavedButtonFocus' : '')}
              onClick={showSavedPress}
              endIcon={<SaveOutlinedIcon />}
            >
              {Constants.APP_MESSAGES.SAVED_POSTS}
            </Button>

        </div>
        <div className="PostListInnerContainer" style={!postsEl.length ? {border: 'none'} : {}} onScroll={onScroll}>
            {postsEl}
        </div>
      </div>
    </div>
    ;
};