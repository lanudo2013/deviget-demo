import { Post } from "../../classes/interfaces/post";
import React from 'react';
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
}
export const PostUI = function(props: PostProps) {
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

    if (!props.post) {
        return null;
    }
    const p = props.post;


    return <div className="PostContainer">
        <div className="Header">
            <span className="Author">{p.author}</span>
            <span className="CreatedAt">{formatCreated(p.createdTime)}</span>
        </div>
        <div className="Body">
            {p.thumbnailUrl ? <img src={p.thumbnailUrl} width={100} height={100} className="Thumbnail" /> : null}
            <span className="Title">{p.title}</span>
        </div>
        <div className="Footer">
            <Button color="default" size={'small'} style={dismissButtonStyle} variant="contained" startIcon={<DeleteIcon />}>Dismiss post</Button>
            <span className="CommentsNum">{p.numberOfComments} comment/s</span>
        </div>
    </div>;
};