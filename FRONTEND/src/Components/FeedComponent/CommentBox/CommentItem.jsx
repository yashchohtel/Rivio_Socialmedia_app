import React, { useState } from 'react'
import './commentBox.css'
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../utility/postCardUtility';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import ReplayItem from './ReplayItem';
import { MdVerified } from 'react-icons/md';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, setReplyContext }) => {

    // console.log(comment);

    // use navigate to navigate to user profile page on click of username or profile image
    const navigate = useNavigate();

    /* -------------------------------------- */

    // Get auth loading state from Redux store
    const loggedInUserId  = useSelector((state) => state.auth?.user?.id);
    
    /* -------------------------------------- */

    // destructure comment data
    const { _id: commentId, user, text, createdAt, likesCount, repliesCount, replies } = comment;

    // destructure user data
    const { id: userId, profileImage, username, isVerified } = user;

    /* -------------------------------------- */

    // navigate function
    const navigateToProfile = (id) => {
        navigate(`/app/profile/${id}`, { state: { user } });
    };

    /* -------------------------------------- */

    // state to show hide comments replies 
    const [showHideReplies, setShowHideReplies] = useState(false);

    // function to show hide comments replies
    const handleShowHideReplies = () => {
        setShowHideReplies(!showHideReplies)
    }

    // open comment replies
    const openCommentReplies = () => {
        setShowHideReplies(true);
    }

    /* -------------------------------------- */

    // function to set replay ontext
    const setReplayContext = () => {

        setReplyContext({
            commentId: commentId, // main comment id
            repliedToUserData: user, // replied to user data
        })

    }

    /* -------------------------------------- */

    return (

        <>

            {/* comment item */}
            <li className="commentItem">

                {/* comment item profile image */}
                <div className="commentItemProfileImg"
                    onClick={() => navigateToProfile(userId)}
                >
                    <img src={profileImage || "/images/userprofile.jpeg"} alt="profile" />
                </div>

                {/* comment item content */}
                <div className="commentItemContent">

                    {/* comment header */}
                    <div className="commentItemHeader">

                        {/* comment and username */}
                        <h4 className="commentAndUsername">

                            {/* username */}
                            <span className="username"
                                onClick={() => navigateToProfile(userId)}
                            >
                                {username}

                                {/* verified batch */}
                                {isVerified && (
                                    <span className="icon">
                                        <MdVerified />
                                    </span>
                                )}

                            </span>

                            {/* comment */}
                            <span className="comment">{text}</span>

                        </h4>

                        {/* comment likes */}
                        <div className="commentItemLikes">
                            <span className="icon"><GoHeart /></span>
                        </div>

                    </div>

                    {/* time like replay */}
                    <div className="commentItemFooter">

                        {/* time */}
                        <span className="timeAgo">{timeAgo(createdAt)}</span>

                        {/* like */}
                        {likesCount > 0 && (
                            <span className="like">{likesCount}</span>
                        )}

                        {/* replay */}
                        <span className="replay"
                            onClick={() => {
                                setReplayContext()
                                openCommentReplies()
                            }}

                        >
                            Reply
                        </span>

                        {/* comment delete button */}
                        {loggedInUserId === userId && (
                            <span className="deleteButton">Delete</span>
                        )}


                    </div>

                    {/* comment replies */}
                    {showHideReplies && replies?.length > 0 && (

                        // replies container
                        <ul className="repliesContainer">

                            {replies.map(reply => (
                                <ReplayItem
                                    key={reply._id} // key
                                    reply={reply} // replay data
                                    commentId={commentId} // main comment id
                                    setReplyContext={setReplyContext} // to set replay context 
                                />
                            ))}

                        </ul>

                    )}

                    {/* view close replay button */}
                    {repliesCount > 0 && (

                        <div className="viewReplayBtn"
                            onClick={handleShowHideReplies}
                        >

                            {/* rule */}
                            <div className="line"></div>

                            {/* button text */}
                            <p className="btnText">
                                {showHideReplies ? "Hide replies" : `View replies (${repliesCount})`}
                            </p>

                        </div>

                    )}

                </div>

            </li>

        </>
    )
};

// export default CommentItem          
export default React.memo(CommentItem);