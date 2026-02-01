import React, { useEffect, useState } from 'react'
import './postCardFooter.css'
import { FaLeaf, FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { handlePostLike } from '../../../features/posts/postThunk';

const PostCardFooter = (props) => {

    // initilize dispatch
    const dispatch = useDispatch();

    // Get auth loading state from Redux store
    const { likeStatus } = useSelector((state) => state.post);

    /* -------------------------------------- */

    // destructure proops
    const { postId, commentsCount, likesCount, sharesCount, isLiked } = props;

    // like count of post
    const [uiLikesCount, setUiLikesCount] = useState(likesCount);

    // state for stroing liked stated
    const [uiIsLiked, setUiIsLiked] = useState(isLiked);

    //  trigger animation
    const [triggerAnimation, setTriggerAnimation] = useState(false);

    // state to store liking process
    const [isLiking, setIsLiking] = useState(false);

    // state to store last intetion
    const [lastIntentin, setLastIntention] = useState(null)

    /* -------------------------------------- */

    // handle like click
    const handleLikeClick = () => {

        // decide users last intention like/unlike the post
        const intention = uiIsLiked ? "unlike" : "like";
        setLastIntention(intention);

        // set liked status inverse of previous state
        setUiIsLiked(prev => !prev);

        // set ui like count plus minus accordint to liked liked
        setUiLikesCount(prev => (uiIsLiked ? prev - 1 : prev + 1));

        // set trigger animation
        setTriggerAnimation(true);

        // rapid click lock
        if (isLiking) return;

        // set isLiking to true
        setIsLiking(true);

        // dispatch handle post like thunk
        dispatch(handlePostLike(postId));

    };

    /* -------------------------------------- */

    // effect to set liking status fasle
    useEffect(() => {

        if (likeStatus === "success" || likeStatus === "error") {
            setIsLiking(false);
        }

    }, [likeStatus]);

    useEffect(() => {
        console.log("UPDATED lastIntention:", lastIntentin);
        console.log("isLiking " + isLiking);
    }, [lastIntentin, isLiking]);

    return (
        <>
            {/* post card footer */}
            <div className="postCardFooter">

                {/* post card footer left */}
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
                        <div className="commentSection iconCountCont">

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

                    {/* post card footer top left */}
                    <div className="postCardFooterTopRight">

                        {/* bookMark section */}
                        <div className="bookMarkSection iconCountCont">

                            {/* icon */}
                            <span className="icon">
                                <FaRegBookmark />
                            </span>

                        </div>

                    </div>

                </div>

                {/* footer bottom */}
                <div className="postCardFooterBottom"></div>

            </div>
        </>
    )
}

export default React.memo(PostCardFooter);