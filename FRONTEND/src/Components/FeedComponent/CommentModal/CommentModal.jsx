/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react'
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

const CommentModal = ({ activePostId, openFeedActionOption }) => {

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
        dispatch(closeCommentModal());
    }

    /* -------------------------------------- */

    // state to make bookmark toast active (on image container)
    const [bookmarkActive, setBookmarkActive] = useState(false);

    // handle bookmark active
    const handleBookmarkActive = useCallback(() => {
        setBookmarkActive(true);
    }, []);


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
                                openFeedActionOption={openFeedActionOption} // to open feed action option modal
                                componentType="commentModal"
                            />
                        </div>

                        {/* caption and comments */}
                        <div className="captionAndComments">

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
                                <CommentBox />

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
                            <WriteComment />
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

export default CommentModal;