import { Post } from "../../classes/interfaces/post";
import React, { ForwardedRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import moment from  'moment';
import './Post.scss';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/CancelOutlined';
import { Constants } from "../../constants";

const DAY_TIME = 1000 * 60 * 60 * 24;
const HOUR_TIME = 1000 * 60 * 60;
const MINUTE_TIME = 1000 * 60;

interface PostProps {
    post: Post;
    currentDate: Date;
    onPress: (p: Post) => void;
    onPressDismiss: (post: Post) => void;
}
export interface PostRef {
    fadeOut: () => Promise<any>;
    id: string;
    slideOut: (delay?: number) => Promise<any>;
}
const PostUIFn = function(props: PostProps, ref1: ForwardedRef<any>) {
    const [pressAnimation, setPressAnimation] = useState<boolean>(false);
    const [fadeOutAnimation, setDismissFadeOutAnimation] = useState<boolean>(false);
    const [slideOutAnimation, setDismissSlideOutAnimation] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(false);
    const resolveFadeOutAnim = useRef<any>(null);
    const resolveSlideAnim = useRef<any>(null);
    const formatCreated = React.useCallback((dt: Date) => {
        const now = props.currentDate;
        const diff = now.getTime() + now.getTimezoneOffset() * 1000 * 60 - dt.getTime();
        const days = Math.floor(diff / DAY_TIME);
        const minutes = Math.floor(diff / MINUTE_TIME);
        const hours = Math.floor(diff / HOUR_TIME);
        if (diff < HOUR_TIME) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < DAY_TIME) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diff < 5 * DAY_TIME) {
            const hoursDiff = Math.floor((diff % DAY_TIME) / HOUR_TIME);
            if (hoursDiff > 0) {
                return `${days} day${days > 1 ? 's' : ''}, ${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
            } else {
                return `${days} day${days > 1 ? 's' : ''} ago`;
            }
            
        } else {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }, []);

    const p = props.post;
    const dismissButtonStyle = React.useMemo(() => ({paddingTop: '1px', paddingBottom: '1px', fontSize: '12px'}), []);
    useImperativeHandle(ref1, () => ({
        fadeOut: () => {
            if (resolveFadeOutAnim.current) {
                return Promise.reject('Animating');
            }

            setDismissFadeOutAnimation(true);
            return new Promise(res => {
                resolveFadeOutAnim.current = res;
            });
        },
        slideOut: (delay?: number) => {
            if (resolveSlideAnim.current) {
                return Promise.reject('Animating');
            }
            if (!delay) {
                setDismissSlideOutAnimation(true);
            }
            return new Promise(res => {
                resolveSlideAnim.current = res;
                if (delay) {
                    setTimeout(() => {
                        setDismissSlideOutAnimation(true);
                    }, delay);
                }
            });
        },
        id: p.id
    }), [p]);

    
    const pressPost = React.useCallback((e) => {
        setPressAnimation(true);
        props.onPress && props.onPress(p);
    }, [props.onPress, p]);

    
    const animEnds = React.useCallback((e) => {
        setPressAnimation(false);
        if (fadeOutAnimation && resolveFadeOutAnim.current) {
            resolveFadeOutAnim.current(true);
        } else if (slideOutAnimation && resolveSlideAnim.current) {
            setHidden(true);
            resolveSlideAnim.current(true);
        }
        resolveSlideAnim.current = null;
        resolveFadeOutAnim.current = null;
        setDismissSlideOutAnimation(false);
        setDismissFadeOutAnimation(false);
    }, [p, fadeOutAnimation, slideOutAnimation]);

    const pressDismiss = React.useCallback((e: any) => {
        e.stopPropagation();
        props.onPressDismiss && props.onPressDismiss(p);
    }, [props.onPressDismiss]);

    const animationClassStr = React.useMemo(() => {
        if (pressAnimation) {
            return' animate__animated animate__headShake';
        } else if (fadeOutAnimation) {
            return ' animate__animated animate__fadeOut';
        } else if (slideOutAnimation) {
            return ' animate__animated animate__slideOutLeft';
        } else {
            return '';
        }
    }, [slideOutAnimation, fadeOutAnimation, pressAnimation]);

    if (!props.post) {
        return null;
    }

    return <div className={'PostContainer ' + animationClassStr} style={hidden ? {visibility: 'hidden'} : {}} onClick={pressPost} onAnimationEnd={animEnds}>
        <div className="Header">
            <span className="Author">{p.author}</span>
            <span className="CreatedAt">{formatCreated(p.createdTime)}</span>
        </div>
        <div className="Body">
            {p.thumbnailUrl ? <img src={p.thumbnailUrl} width={100} height={100} className="Thumbnail" /> : null}
            <span className="Title">{p.title}</span>
        </div>
        <div className="Footer">
            <Button onClick={pressDismiss} color="default" size={'small'} style={dismissButtonStyle} variant="contained" startIcon={<DeleteIcon />}>${Constants.APP_MESSAGES.DISMISS_BUTTON}</Button>
            <span className="CommentsNum">{p.numberOfComments} comment/s</span>
        </div>
    </div>;
};
export const PostUI = React.forwardRef(PostUIFn);