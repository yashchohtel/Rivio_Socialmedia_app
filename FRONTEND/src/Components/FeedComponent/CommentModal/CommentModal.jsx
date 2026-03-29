/* eslint-disable no-unused-vars */
import React, { useCallback, useRef, useState } from 'react'
import './commentModal.css'
import { closeCommentModal } from '../../../features/comment/commentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { IoCloseSharp } from "react-icons/io5";
import FeedImageContainer from '../FeedImageContainer/FeedImageContainer';
import PostCardHeader from '../PostCardHeader/PostCardHeader';
import PostCardFooterTop from '../PostCardFooterTop/PostCardFooterTop';
import PostCardCaption from '../PostCardCaption/PostCardCaption';
import WriteComment from '../WriteComment/WriteComment';
import CommentBox from '../CommentBox/CommentBox';
import { useEffect } from 'react';
import { getCommentsForPost } from '../../../features/comment/commentThunk';

const CommentModal = ({ activePostId }) => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    // posts from redux store
    const { posts } = useSelector((state) => state.post);

    // get post data for active post id
    const post = posts.find((p) => p._id === activePostId);

    // destructure media from post data
    const { _id, commentsCount, likesCount, sharesCount, isLiked, isBookmarked, user, createdAt, location, isOwnPost, isFollowing, media, bookmarkStatus, caption } = post;

    /* -------------------------------------- */

    // function to close comment modal
    const handleCloseModal = () => {

        // close modal
        dispatch(closeCommentModal());

        // set reply context to null
        setReplyContext({
            commentId: null,
            repliedToUserId: null,
            replyToUsername: null,
            replyId: null
        });
    }

    /* -------------------------------------- */

    // state to make bookmark toast active (on image container)
    const [bookmarkActive, setBookmarkActive] = useState(false);

    // handle bookmark active
    const handleBookmarkActive = useCallback(() => {
        setBookmarkActive(true);
    }, []);

    /* -------------------------------------- */

    // state to store replay content usefull for replay feature getting data from comment box and sending it to write comment 
    const [replyContext, setReplyContext] = useState({
        commentId: null,         // comment replay
        repliedToUserData: null, // replied to user data
        replyId: null,           // reply id (only for reply on reply)
    });

    /* -------------------------------------- */

    // refrence of caption and comments fox
    const captionAndCommentsRef = useRef(null);

    // functin to scroll captionAndComments to top when commed aded
    const scrollToTop = () => {
        captionAndCommentsRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* -------------------------------------- */

    // state to store highlight status
    const [highlightFirst, setHighlightFirst] = useState(false);
    
    // function to make first newly comment added highlight
    const highlightComment = () => {
        setHighlightFirst(true);
        setTimeout(() => setHighlightFirst(false), 1500);
    }

    /* -------------------------------------- */

    // effect to load comments for active post id when comment modal opens
    useEffect(() => {

        if (activePostId) {

            // dispatch get comments for post action
            dispatch(getCommentsForPost(activePostId));

        }

    }, [activePostId]);

    /* -------------------------------------- */

    return (
        <>
            {/* commentModalOverLay */}
            <div className="commentModalOverLay" onClick={handleCloseModal} >

                {/* commentModal */}
                <div className="commentModal" onClick={(e) => e.stopPropagation()}>

                    {/* image container */}
                    <div className="commentBoxImgCont">
                        <FeedImageContainer
                            media={media}
                            bookmarkStatus={bookmarkStatus}
                            componentType="commentModal"
                        />
                    </div>

                    {/* comments info container */}
                    <div className="commentsInfoCont">

                        {/* comment info cont head */}
                        <div className="commentInfoContHead">
                            <PostCardHeader
                                user={user}
                                createdAt={createdAt}
                                location={location}
                                isOwnPost={isOwnPost}
                                isFollowing={isFollowing}
                                componentType="commentModal"
                            />
                        </div>

                        {/* caption and comments */}
                        <div
                            className="captionAndComments"
                            ref={captionAndCommentsRef}
                        >

                            {/* caption component */}
                            {caption && (
                                <PostCardCaption
                                    caption={caption}
                                    user={user}
                                    componentType="commentModal"
                                />
                            )}

                            {/* rule */}
                            {caption && (
                                <div className="commentrule"></div>
                            )}

                            {/* comment box container */}
                            <div className="commentBoxContainer">

                                {/* comment box container skeetons and actual comments*/}
                                <CommentBox
                                    activePostId={activePostId} // acctive post id for comment
                                    setReplyContext={setReplyContext} // to set replay context
                                    highlightFirst={highlightFirst} // to hightlight first new added comment
                                />

                            </div>

                        </div>

                        {/* pots actions Container */}
                        <div className="postActionContainer">

                            {/* post card footer top component */}
                            <PostCardFooterTop
                                postId={_id}
                                commentsCount={commentsCount}
                                likesCount={likesCount}
                                sharesCount={sharesCount}
                                isLiked={isLiked}
                                isBookmarked={isBookmarked}
                                handleBookmarkActive={handleBookmarkActive}
                            />

                        </div>

                        {/* comment writing field */}
                        <div className="writeCommentCont">

                            <WriteComment
                                postId={_id} // active post id for writing comment
                                replyContext={replyContext} // replay context to reply on comments
                                setReplyContext={setReplyContext} // set reply context
                                scrollToTop={scrollToTop} // scroll to top when commend added
                                highlightComment={highlightComment} // funcion to make first comment hight light
                            />

                        </div>

                    </div>

                </div>

                {/* close button */}
                <span
                    className="commentModalClose"
                    onClick={handleCloseModal}
                >
                    <IoCloseSharp />
                </span>

            </div>
        </>
    )
}

// export default CommentModal;
export default React.memo(CommentModal);