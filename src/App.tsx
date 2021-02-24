import { Backdrop, CircularProgress, Fade, Modal } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import { AppState } from './classes/interfaces/appstate';
import { PostDetail } from './components/post-detail/PostDetail';
import { PostList } from './components/post-list/PostList';
import { PostService } from './services/PostService';
import { updateCurrentError } from './state/actions';

function App() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const fetchingPosts = useSelector((state: AppState) => state.fetchingPosts);
  const currentError = useSelector((state: AppState) => state.currentError);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      dispatch(updateCurrentError(''));
    }, 280);
    
  };

  useEffect(() => {
    if (fetchingPosts || currentError) {
        setOpen(true);
    } else {
        setOpen(false);
    }
  }, [fetchingPosts, currentError]);


  return (
    <div className="App">
      <PostList />
      <PostDetail />
      <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          className="Modal"
          open={open}
          onClose={handleClose}
          closeAfterTransition={true}
          disableBackdropClick={fetchingPosts}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            {
             currentError ? <div className="Paper">
                        <span className="Modal-title">Error</span>
                        <span className="Modal-description">{currentError}</span>
                      </div>
             : <div className="Paper">
                  <span className="Modal-title">Loading...</span>
                  <CircularProgress color="secondary" /> 
               </div>
            }
            
          </Fade>
      </Modal>
    </div>
  );
}

export default App;
