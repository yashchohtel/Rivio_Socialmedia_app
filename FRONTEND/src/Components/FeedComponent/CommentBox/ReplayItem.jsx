import React from 'react'
import './commentBox.css'
import { GoHeart } from 'react-icons/go';
import { timeAgo } from '../../../utility/postCardUtility';

const ReplayItem = ({ reply }) => {

  // console.log(reply)

  // destructure reply data
  const { _id, text, likesCount, createdAt, repliedBy, repliedTo, } = reply;

  // replied by user data
  const repliedByUsername = repliedBy?.username;
  const repliedByProfileImage = repliedBy?.profileImage;

  // replied to user data
  const repliedToUsername = repliedTo?.username;
  // const repliedToProfileImage = repliedTo?.profileImage;

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
              <span className="username"> {repliedByUsername} </span>

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
            <span className="replay">Reply</span>

          </div>

        </div>

      </li>

    </>

  )

}

export default ReplayItem