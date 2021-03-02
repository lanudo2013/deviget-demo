import { Post } from '../../classes/interfaces/post';
import React, { ForwardedRef, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react';
import moment from 'moment';
import './Post.scss';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/CancelOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SaveIcon from '@material-ui/icons/SaveOutlined';
import Icon from '@material-ui/core/Icon';
import { Constants } from '../../constants';
import Intl from 'intl';
import { AnyIfEmpty } from 'react-redux';
import { PostType } from '../../classes/enums/post-type';

const DAY_TIME = 1000 * 60 * 60 * 24;
const HOUR_TIME = 1000 * 60 * 60;
const MINUTE_TIME = 1000 * 60;

interface PostProps {
    post: Post;
    currentDate: Date;
    onPress: (p: Post) => void;
    onPressSave?: (p: Post) => void;
    onPressRemoved?: (p: Post) => void;
    read?: boolean;
    canRemove?: boolean;
    saved?: boolean;
    onPressDismiss: (post: Post) => void;
}
export interface PostRef {
    fadeOut: () => Promise<any>;
    id: string;
    slideOut: (delay?: number) => Promise<any>;
}
const PostUIFn = function (props: PostProps, ref1: ForwardedRef<any>) {
    const [pressAnimation, setPressAnimation] = useState<boolean>(false);
    const [fadeOutAnimation, setDismissFadeOutAnimation] = useState<boolean>(false);
    const [slideOutAnimation, setDismissSlideOutAnimation] = useState<boolean>(false);
    const [hidden, setHidden] = useState<boolean>(false);
    const resolveFadeOutAnim = useRef<any>(null);
    const resolveSlideAnim = useRef<any>(null);
    const formatCreatedAt = React.useCallback(
        (dt: Date) => {
            const now = props.currentDate;
            if (now && dt) {
                const diff = now.getTime() + now.getTimezoneOffset() * 1000 * 60 - dt.getTime();
                const days = Math.floor(diff / DAY_TIME);
                const minutes = Math.floor(diff / MINUTE_TIME);
                const hours = Math.floor(diff / HOUR_TIME);
                if (diff > 0) {
                    if (diff < MINUTE_TIME) {
                        return 'Seconds ago';
                    } else if (diff < HOUR_TIME) {
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
                }
            }
            return '';
        },
        [props.currentDate]
    );

    const p = props.post;
    const dismissButtonStyle = React.useMemo(
        () => ({ paddingTop: '1px', paddingBottom: '1px', fontSize: '12px', marginRight: '5px' }),
        []
    );
    useImperativeHandle(
        ref1,
        () => ({
            fadeOut: () => {
                if (resolveFadeOutAnim.current) {
                    return Promise.reject('Animating');
                }

                setDismissFadeOutAnimation(true);
                return new Promise((res) => {
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
                return new Promise((res) => {
                    resolveSlideAnim.current = res;
                    if (delay) {
                        setTimeout(() => {
                            setDismissSlideOutAnimation(true);
                        }, delay);
                    }
                });
            },
            id: p.id
        }),
        [p]
    );

    const formatter = React.useMemo(() => {
        return new Intl.NumberFormat('en-IR');
    }, []);

    const pressPost = React.useCallback(
        (e) => {
            setPressAnimation(true);
            props.onPress && props.onPress(p);
        },
        [props.onPress, p]
    );

    const pressSave = React.useCallback(
        (e: any) => {
            e.stopPropagation();
            props.onPressSave && props.onPressSave(p);
        },
        [props.onPressSave, p]
    );

    const animEnds = React.useCallback(
        (e) => {
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
        },
        [p, fadeOutAnimation, slideOutAnimation]
    );

    const pressDismiss = React.useCallback(
        (e: any) => {
            e.stopPropagation();
            props.onPressDismiss && props.onPressDismiss(p);
        },
        [props.onPressDismiss, p]
    );

    const pressRemoved = React.useCallback(
        (e: any) => {
            e.stopPropagation();
            props.onPressRemoved && props.onPressRemoved(p);
        },
        [props.onPressRemoved, p]
    );

    const animationClassStr = React.useMemo(() => {
        if (pressAnimation) {
            return ' animate__animated animate__headShake';
        } else if (fadeOutAnimation) {
            return ' animate__animated animate__fadeOut';
        } else if (slideOutAnimation) {
            return ' animate__animated animate__slideOutLeft';
        } else {
            return '';
        }
    }, [slideOutAnimation, fadeOutAnimation, pressAnimation]);

    const openFullSizeImage = React.useCallback(
        (e) => {
            const val = p.postUrl || '';
            if (p.postType === PostType.IMAGE && (val.endsWith('.jpg') || val.endsWith('.png') || val.endsWith('.gif') || val.endsWith('.jpeg'))) {
                e.stopPropagation();
                window.open(p.postUrl, '_blank');
            }
        },
        [p]
    );

    if (!props.post) {
        return null;
    }

    return (
        <div
            className={'PostContainer ' + animationClassStr}
            style={hidden ? { visibility: 'hidden' } : {}}
            onClick={pressPost}
            onAnimationEnd={animEnds}
        >
            <div className="Header">
                <div className="Header-left">
                    {!props.read ? <Icon className="ReadIcon">fiber_manual_record</Icon> : null}
                    <span className="Author" style={props.read ? { left: 0 } : null}>
                        {p.author}
                    </span>
                </div>
                <div className="Header-right">
                    {props.saved ? <Icon className="SavedIcon">save</Icon> : null}
                    <span className="CreatedAt">{formatCreatedAt(p.createdTime)}</span>
                </div>
            </div>
            <div className="Body">
                {p.thumbnailUrl ? (
                    <img
                        src={p.thumbnailUrl}
                        width={100}
                        height={100}
                        onClick={openFullSizeImage}
                        className={'Thumbnail ' + (p.postType === PostType.IMAGE ? 'Clickable' : '')}
                    />
                ) : null}
                <span className="Title">{p.title}</span>
            </div>
            <div className="Footer">
                <div className="PostOptions">
                    {!props.saved ? (
                        <>
                            <Button
                                onClick={pressDismiss}
                                color="default"
                                size={'small'}
                                style={dismissButtonStyle}
                                variant="contained"
                                className="DismissButton"
                                startIcon={<DeleteIcon />}
                            >
                                {Constants.APP_MESSAGES.DISMISS_BUTTON}
                            </Button>
                            <Button
                                onClick={pressSave}
                                color="default"
                                size={'small'}
                                style={dismissButtonStyle}
                                variant="contained"
                                className="SaveButton"
                                startIcon={<SaveIcon />}
                            >
                                {Constants.APP_MESSAGES.SAVE_BUTTON}
                            </Button>
                        </>
                    ) : (
                        <>
                            {props.canRemove ? (
                                <Button
                                    onClick={pressRemoved}
                                    color="default"
                                    size={'small'}
                                    style={dismissButtonStyle}
                                    variant="contained"
                                    className="RemoveButton"
                                    startIcon={<DeleteOutlineIcon />}
                                >
                                    {Constants.APP_MESSAGES.REMOVE_BUTTON}
                                </Button>
                            ) : (
                                <Button
                                    onClick={pressDismiss}
                                    color="default"
                                    size={'small'}
                                    style={dismissButtonStyle}
                                    variant="contained"
                                    className="DismissButton"
                                    startIcon={<DeleteIcon />}
                                >
                                    {Constants.APP_MESSAGES.DISMISS_BUTTON}
                                </Button>
                            )}
                        </>
                    )}
                </div>

                <span className="CommentsNum">
                    {p.numberOfComments > 0 ? formatter.format(p.numberOfComments) + ' comment/s' : 'No comments'}
                </span>
            </div>
        </div>
    );
};
export const PostUI = React.forwardRef(PostUIFn);
