/* eslint-disable no-unused-vars */
import React from 'react'
import './commentBox.css'
import { GoHeart } from 'react-icons/go';
import { timeAgo } from '../../../utility/postCardUtility';
import { MdVerified } from 'react-icons/md';

const ReplayItem = ({ reply, setReplyContext, commentId, handleDeleteClick, loggedInUserId, postId }) => {

  // console.log(reply)  

  // destructure reply data
  const { _id: replyId, text, likesCount, createdAt, repliedBy, repliedTo, } = reply;

  // replied by user data
  const repliedByUserId = repliedBy?.id;
  const repliedByUsername = repliedBy?.username;
  const repliedByProfileImage = repliedBy?.profileImage;
  const repliedByIsVerified = repliedBy?.isVerified;

  // replied to user data
  const repliedToUserId = repliedTo?.id;
  const repliedToUsername = repliedTo?.username;
  const repliedToProfileImage = repliedTo?.profileImage;

  /* -------------------------------------- */

  // function to set replay ontext
  const setReplayContext = () => {

    setReplyContext({
      commentId: commentId,   // comment replay
      repliedToUserData: repliedBy, // replied to user data
      replyId: replyId,  // reply id (only for reply on reply)
    })

  };

  /* -------------------------------------- */

  return (

    <>

      {/* comment item */}
      <li className="commentItem">

        {/* comment item profile image */}
        <div className="commentItemProfileImg">
          <img src={repliedByProfileImage || "/images/userprofile.jpeg"} alt="profile" />
        </div>

        {/* comment item content */}
        <div className="commentItemContent">

          {/* comment header */}
          <div className="commentItemHeader">

            {/* comment and username */}
            <h4 className="commentAndUsername">

              {/* username */}
              <span className="username">

                {repliedByUsername}

                {/* verified batch */}
                {repliedByIsVerified && (
                  <span className="icon">
                    <MdVerified />
                  </span>
                )}

              </span>


              {/* replied to usernam */}
              <span className="username repliedToUsername"> @{repliedToUsername} </span>

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
              onClick={setReplayContext}
            >
              Reply
            </span>

            {/* comment delete button */}
            {loggedInUserId === repliedByUserId && (

              <span
                className="deleteButton"
                onClick={() => handleDeleteClick({ action: "deleteReply", commentId, postId, replyId })}
              >
                Delete
              </span>

            )}

          </div>

        </div>

      </li>

    </>

  )

}

export default ReplayItem