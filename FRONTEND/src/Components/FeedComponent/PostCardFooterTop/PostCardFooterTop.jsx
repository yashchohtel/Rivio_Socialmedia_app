import { FaLeaf, FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { handlePostBookmark, handlePostLike } from '../../../features/posts/postThunk';
import { openCommentModal } from "../../../features/comment/commentSlice";

const PostCardFooterTop = (props) => {

    // destructure proops
    const { postId, commentsCount, likesCount, sharesCount, isLiked, isBookmarked, handleBookmarkActive } = props;

    /* -------------------------------------- */

    // initilize dispatch
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // like count of post
    const [uiLikesCount, setUiLikesCount] = useState(likesCount);

    // state for stroing liked status
    const [uiIsLiked, setUiIsLiked] = useState(isLiked);

    //  trigger animation
    const [triggerAnimation, setTriggerAnimation] = useState(false);

    // handle like click
    const handleLikeClick = () => {

        // set liked status inverse of previous state
        setUiIsLiked(prev => !prev);

        // set ui like count plus minus accordint to liked 
        setUiLikesCount(prev => (uiIsLiked ? prev - 1 : prev + 1));

        // set trigger animation
        setTriggerAnimation(true);

        // dispatch handle post like thunk
        dispatch(handlePostLike(postId));

    };

    /* -------------------------------------- */

    // state to store bookmarked status
    const [uiIsBookMarked, setUiIsBookMarked] = useState(isBookmarked)

    // handle postBookMark
    const handlePostBookMark = () => {

        // set liked status inverse of previous state
        setUiIsBookMarked(prev => !prev);

        // dispatch handle post like thunk
        dispatch(handlePostBookmark(postId));

    }

    /* -------------------------------------- */

    // function to handle comment click
    const handleCoommentClick = () => {
        dispatch(openCommentModal(postId));
    }

    /* -------------------------------------- */

    useEffect(() => {
        setUiIsBookMarked(isBookmarked);
    }, [isBookmarked]);

    /* -------------------------------------- */

    return (
        <>
            <div className="postCardFooterTop">

                {/* post card footer top left */}
                <div className="postCardFooterTopLeft">

                    {/* like section */}
                    <div className="likeSection iconCountCont"

                        onClick={() => {
                            handleLikeClick();
                        }}>

                        {/* icon */}
                        <span className="icon">

                            {/* heart outline */}
                            <span
                                className={`heartOutline ${!uiIsLiked ? "active" : ""} ${triggerAnimation ? "animate" : ""}`}>
                                <FaRegHeart />
                            </span>

                            {/* heart filled */}
                            <span
                                className={`heartFilled ${uiIsLiked ? "active" : ""} ${triggerAnimation ? "animate" : ""}`}>
                                <FaHeart />
                            </span>

                        </span>

                        {/* count */}
                        {uiLikesCount > 0 && (
                            <span className="count">{uiLikesCount}</span>
                        )}

                    </div>

                    {/* comment section */}
                    <div
                        className="commentSection iconCountCont"
                        onClick={() => handleCoommentClick()}
                    >

                        {/* icon */}
                        <span className="icon">
                            <FaRegComment />
                        </span>

                        {/* count */}
                        {commentsCount > 0 && (
                            <span className="count">987</span>
                        )}

                    </div>

                    {/* share section */}
                    <div className="shareSection iconCountCont">

                        {/* icon */}
                        <span className="icon">
                            <PiPaperPlaneTiltBold />
                        </span>

                        {/* count */}
                        {sharesCount > 0 && (
                            <span className="count">45</span>
                        )}

                    </div>

                </div>

                {/* post card footer top right */}
                <div className="postCardFooterTopRight">

                    {/* bookMark section */}
                    <div
                        className="bookMarkSection iconCountCont"
                        onClick={() => {
                            handlePostBookMark()
                            handleBookmarkActive()
                        }}
                    >

                        {/* icon */}
                        <span className="icon">
                            {uiIsBookMarked ? <FaBookmark /> : <FaRegBookmark />}
                        </span>

                    </div>

                </div>

            </div>
        </>
    )
}

export default PostCardFooterTop