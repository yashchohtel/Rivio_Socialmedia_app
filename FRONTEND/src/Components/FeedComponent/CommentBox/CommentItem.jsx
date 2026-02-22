/* eslint-disable no-unused-vars */
import React from 'react'
import './commentBox.css'
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../utility/postCardUtility';

import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";

const CommentItem = ({ comment }) => {

    // console.log(comment);
    
    // use navigate to navigate to user profile page on click of username or profile image
    const navigate = useNavigate();

    /* -------------------------------------- */

    // destructure comment data
    const { user, text, createdAt, likesCount } = comment;

    // destructure user data
    const { _id, profileImage, username } = user;

    /* -------------------------------------- */

    // navigate function
    const navigateToProfile = (id) => {
        navigate(`/app/profile/${id}`, { state: { user } });
    };

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
                        <span className="like">45 Like</span>

                        {/* replay */}
                        <span className="replay">Replay</span>

                    </div>

                </div>

            </li>

        </>
    )
}

// export default CommentItem          
export default React.memo(CommentItem);