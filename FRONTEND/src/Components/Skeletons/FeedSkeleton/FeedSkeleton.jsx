import React from 'react'
import "./feedSkeleton.css"

const FeedSkeleton = () => {
    return (
        <>
            {/* post skeleton skeleton */}
            <div className="postSkeleton">

                {/* header */}
                <div className="postHeaderSkeleton">

                    {/* avatar */}
                    <div className="avatarSkeleton"></div>

                    {/* info */}
                    <div className="lineSkeleton">
                        <div className="line1"></div>
                        <div className="line2"></div>
                    </div>

                </div>

                {/* image */}
                <div className="postImageSkeleton"></div>

            </div>

        </>
    )
}

export default FeedSkeleton