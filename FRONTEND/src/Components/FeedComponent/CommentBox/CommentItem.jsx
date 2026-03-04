import React, { useState } from 'react'
import './commentBox.css'
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../utility/postCardUtility';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import ReplayItem from './ReplayItem';

const CommentItem = ({ comment }) => {

    // console.log(comment);

    // use navigate to navigate to user profile page on click of username or profile image
    const navigate = useNavigate();

    /* -------------------------------------- */

    // destructure comment data
    const { user, text, createdAt, likesCount, repliesCount, replies } = comment;

    // destructure user data
    const { _id, profileImage, username } = user;

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

    /* -------------------------------------- */

    return (

        <>

            {/* comment item */}
            <li className="commentItem">

                {/* comment item profile image */}
                <div className="commentItemProfileImg"
                    onClick={() => navigateToProfile(_id)}
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
                                onClick={() => navigateToProfile(_id)}
                            >
                                {username}
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
                        <span className="replay">Reply</span>

                    </div>

                    {/* comment replies */}
                    {showHideReplies && replies?.length > 0 && (

                        // replies container
                        <ul className="repliesContainer">

                            {replies.map(reply => (
                                <ReplayItem key={reply._id} reply={reply} />
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