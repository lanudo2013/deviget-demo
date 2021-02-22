import { Post } from "../../classes/interfaces/post";
import React, { useState } from 'react';
import moment from  'moment';
import './Post.scss';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/CancelOutlined';

const DAY_TIME = 1000 * 60 * 60 * 24;
const HOUR_TIME = 1000 * 60 * 60;
const MINUTE_TIME = 1000 * 60;

interface PostProps {
    post: Post;
    currentDate: Date;
    onPress: (p: Post) => void;
    onDismiss: (post: Post) => void;
}
export const PostUI = function(props: PostProps) {
    const [pressAnimation, setPressAnimation] = useState<boolean>(false);
    const [dismissAnimation, setDismissAnimation] = useState<boolean>(false);
    const formatCreated = React.useCallback((dt: Date) => {
        const now = props.currentDate;
        const diff = now.getTime() - dt.getTime();
        if (diff < HOUR_TIME) {
            return `${Math.floor(diff / MINUTE_TIME)} minutes ago`;
        } else if (diff < DAY_TIME) {
            return `${Math.floor(diff / HOUR_TIME)} hours ago`;
        } else if (diff < 5 * DAY_TIME) {
            return `${Math.floor(diff / DAY_TIME)} days, ${(diff % DAY_TIME) / HOUR_TIME} hours ago`;
        } else {
            return `${Math.floor(diff / DAY_TIME)} days ago`;
        }
    }, []);

    const dismissButtonStyle = React.useMemo(() => ({paddingTop: '1px', paddingBottom: '1px', fontSize: '12px'}), []);

    const p = props.post;
    const pressPost = React.useCallback((e) => {
        setPressAnimation(true);
        props.onPress && props.onPress(p);
    }, [props.onPress, p]);

    
    const animEnds = React.useCallback((e) => {
        setPressAnimation(false);
        if (dismissAnimation) {
            props.onDismiss && props.onDismiss(p);
        }
    }, [p, props.onDismiss]);

    const pressDismiss = React.useCallback((e: any) => {
        e.stopPropagation();
        setDismissAnimation(true);
    }, []);

    if (!props.post) {
        return null;
    }
    


    return <div className={'PostContainer ' + (pressAnimation ? ' animate__animated animate__headShake' : '') + (dismissAnimation ? 'animate__animated animate__fadeOut' : '')} onClick={pressPost} onAnimationEnd={animEnds}>
        <div className="Header">
            <span className="Author">{p.author}</span>
            <span className="CreatedAt">{formatCreated(p.createdTime)}</span>
        </div>
        <div className="Body">
            {p.thumbnailUrl ? <img src={p.thumbnailUrl} width={100} height={100} className="Thumbnail" /> : null}
            <span className="Title">{p.title}</span>
        </div>
        <div className="Footer">
            <Button onClick={pressDismiss} color="default" size={'small'} style={dismissButtonStyle} variant="contained" startIcon={<DeleteIcon />}>Dismiss post</Button>
            <span className="CommentsNum">{p.numberOfComments} comment/s</span>
        </div>
    </div>;
};