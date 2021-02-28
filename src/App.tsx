import { Backdrop, CircularProgress, Fade, Modal } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import { AppState } from './classes/interfaces/appstate';
import { PostDetail } from './components/post-detail/PostDetail';
import { PostList } from './components/post-list/PostList';
import { Constants } from './constants';
import { PostService } from './services/PostService';
import { updateCurrentError } from './state/actions';
import 'intl/locale-data/jsonp/en-US';

function App() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const fetchingPosts = useSelector((state: AppState) => state.fetchingPosts);
  const currentError = useSelector((state: AppState) => state.currentError);

  const handleClose = React.useCallback(() => {
    setModalOpen(false);
    dispatch(updateCurrentError(''));
  }, [dispatch]);

  useEffect(() => {
    if (fetchingPosts || currentError) {
      setModalOpen(true);
    } else {
      setModalOpen(false);
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
          open={modalOpen}
          onClose={handleClose}
          closeAfterTransition={true}
          disableBackdropClick={fetchingPosts}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modalOpen}>
            {
             currentError ? <div className="Paper">
                        <span className="Modal-title">{Constants.APP_MESSAGES.ERROR_TITLE}</span>
                        <span className="Modal-description">{currentError}</span>
                      </div>
             : fetchingPosts ? <div className="Paper">
                  <span className="Modal-title">{Constants.APP_MESSAGES.LOADING}...</span>
                  <CircularProgress color="secondary" /> 
               </div> : <div></div>
            }
            
          </Fade>
      </Modal>
    </div>
  );
}

export default App;
