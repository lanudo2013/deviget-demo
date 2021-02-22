import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './App.scss';
import {PostUI} from './components/post/Post';
import { AppState } from './classes/interfaces/appstate';
import { requestPosts } from './state/actions';

function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state: AppState) => state.posts);
  useEffect(() => {
    dispatch(requestPosts(0, 25));
  }, []);

  const currentDate = React.useMemo(() => new Date(), []);


  const postsEl = React.useMemo(() => {
    return posts.map(x => <PostUI key={x.id} post={x} currentDate={currentDate}></PostUI>);
  }, [currentDate, posts]);

  return (
    <div className="App">
      {postsEl}
    </div>
  );
}

export default App;
