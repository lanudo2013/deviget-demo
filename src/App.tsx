import React, { useEffect } from 'react';
import './App.scss';
import { PostList } from './components/post-list/PostList';
import { PostService } from './services/PostService';

function App() {

  return (
    <div className="App">
      <PostList />
    </div>
  );
}

export default App;
