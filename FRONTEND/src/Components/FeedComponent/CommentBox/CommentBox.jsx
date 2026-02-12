import React from 'react'
import './commentBox.css'
import CommentSkeleton from '../../Skeletons/CommentSkeleton/CommentSkeleton'
import EmojiPicker from '../../EmojiPicker/EmojiPicker'

const CommentBox = () => {
  return (
    <>
      {/* commentBox */}
      <div className="commentBox">

        {/* skeleton container */}
        <div className="commentSkeletonContainer">

          {Array.from({ length: 4 }).map((_, i) => (
            <CommentSkeleton key={i} />
          ))}

        </div>



      </div>
    </>
  )
}

export default CommentBox