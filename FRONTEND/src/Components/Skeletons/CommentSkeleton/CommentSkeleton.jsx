import React from 'react'
import "./commentSkeleton.css"

const CommentSkeleton = () => {
    return (

        <>
            {/* comment skeleton */}
            <div className="commentSkeleton">

                {/* avator */}
                <div className="avator"></div>

                {/* info lines */}
                <div className="infoLines">
                    <div className="infoLineOne"></div>
                    <div className="infoLineTwo"></div>
                </div>

            </div>
        </>

    )
}

export default CommentSkeleton