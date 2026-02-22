import React from 'react'
import './commentBox.css'
import CommentSkeleton from '../../Skeletons/CommentSkeleton/CommentSkeleton'
import { useSelector } from 'react-redux';
import CommentItem from './CommentItem';

const CommentBox = ({ activePostId }) => {

  // Get comment initial state from Redux store
  const { commentLoading } = useSelector((state) => state.comment);

  // get active post id and comment modal open status from redux store
  const comments = useSelector(state => state.comment.commentsByPostId[activePostId]?.comments) || [];

  // const {commentsByPostId} = useSelector(state => state.comment);
  // console.log(commentsByPostId);
  
  return (

    <>

      {/* commentBox */}
      <div className="commentBox">

        {/* skeleton container */}
        <div className="commentSkeletonContainer">

          {/* show comment skeleton if comment loading is true */}
          {commentLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <CommentSkeleton key={i} />
            )))
          }

        </div>

        {/* no comments message */}
        {!commentLoading && comments.length === 0 && (
          <h3 className="noCommentsMessage">
            No comments yet
          </h3>
        )}

        {/* comment list container */}
        <ul className="CommentItemContainer">

          {/* show comment items if comment loading is false */}
          {!commentLoading && comments.map((comment) => (

            <CommentItem
              key={comment._id}
              comment={comment}
            />

          ))}

        </ul>

      </div>

    </>
  )
}

export default React.memo(CommentBox);