import React, { useState } from 'react'
import './notificationItem.css'
import { timeAgo } from '../../../utility/postCardUtility';
import { useNavigate } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import { openDeleteConfirmModal } from '../../../features/confirmation/confirmationSlice';
import { useDispatch } from 'react-redux';

const NotificationItem = ({ notification, closeModal }) => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // initilize useNavigate 
    const navigate = useNavigate();

    /* -------------------------------------- */

    // destruvture data from notificaion object
    const { _id: notificationId, type, sender, post, comment, reply, isRead, createdAt } = notification;

    /* -------------------------------------- */

    // state to store expended status for comment content
    const [expanded, setExpanded] = useState(false);

    // generate message based on type
    const getMessage = () => {
        switch (type) {
            case "POST_LIKE": return "liked your post.";
            case "POST_COMMENT": return `commented: ${comment?.commentText || ''}`;
            case "COMMENT_LIKE": return `liked your comment: ${comment?.commentText || ''}`;
            case "COMMENT_REPLY": return `replied: ${reply?.replyText || ''}`;
            case "REPLY_LIKE": return `liked your reply: ${reply?.replyText || ''}`;
            case "FOLLOW": return "started following you.";
            case "FOLLOW_REQUEST": return "requested to follow you.";
            case "FOLLOW_ACCEPTED": return "accepted your follow request.";
            default: return "";
        }
    };

    // message to diaplay on comment item
    const message = getMessage();
    const isLong = message.length > 60;
    const displayMessage = isLong && !expanded ? message.slice(0, 60) + "..." : message;

    /* -------------------------------------- */

    // function to handle navigate to user profile
    const navigateToProfile = (id) => {

        // navigate to profile page with user profile data
        navigate(`/app/profile/${id}`, {
            state: { user: sender }
        })

        // close modal
        closeModal();

    };

    /* -------------------------------------- */

    // handle comment delete clik 
    const handleDeleteClick = (meta) => {

        dispatch(openDeleteConfirmModal({
            message: `delete this notification?`,
            meta
        }));

    };

    /* -------------------------------------- */

    return (
        <>

            {/* notificationItem */}
            <div className={`notificationItem ${isRead ? "" : "unread"}`}>

                {/* avatar */}
                <div className="notiAvatar"
                    onClick={() => navigateToProfile(sender.id)}
                >

                    {sender?.profileImage ?
                        <img src={sender.profileImage} alt="profile" />
                        :
                        <img src="/images/userprofile.jpeg" alt="profile" />
                    }

                </div>

                {/* content */}
                <div className="notiContent">

                    {/* notification text */}
                    <p className="notiText">

                        {/* sender */}
                        <span className="notiUsername"
                            onClick={() => navigateToProfile(sender.id)}
                        >
                            {sender?.username}

                            {/* verified batch */}
                            {sender.isVerified && (
                                <span className="icon">
                                    <MdVerified />
                                </span>
                            )}

                        </span>

                        {displayMessage}

                        {/* more less button */}
                        {isLong && (
                            <span
                                className="notiToggle"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? " less" : " more"}
                            </span>
                        )}

                    </p>

                    {/* time and delete */}
                    <div className="timeAndDelete">

                        {/* time */}
                        <span className="notiTime">{timeAgo(createdAt)}</span>

                        {/* delete */}
                        <button
                            className="delete"
                            onClick={() => handleDeleteClick({ action: "deleteNotification", notificationId })}
                        >
                            delete
                        </button>

                    </div>

                </div>

                {/* thumbnail */}
                {post?.thumbnail && (
                    <div className="notiThumbnail">
                        <img src={post.thumbnail} alt="post" />
                    </div>
                )}

            </div>

        </>
    )
}

export default NotificationItem