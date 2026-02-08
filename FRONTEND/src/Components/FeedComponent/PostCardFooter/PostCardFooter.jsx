import React from 'react'
import './postCardFooter.css'
import PostCardCaption from '../PostCardCaption/PostCardCaption';
import PostCardFooterTop from '../PostCardFooterTop/PostCardFooterTop';

const PostCardFooter = (props) => {

    // destructure proops
    const { user, postId, commentsCount, likesCount, sharesCount, isLiked, isBookmarked, handleBookmarkActive, caption, } = props;

    return (
        <>
            {/* post card footer */}
            <div className="postCardFooter">

                {/* post card footer top */}
                <PostCardFooterTop
                    postId={postId}
                    commentsCount={commentsCount}
                    likesCount={likesCount}
                    sharesCount={sharesCount}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    handleBookmarkActive={handleBookmarkActive}
                />

                {/* footer bottom */}
                <div className="postCardFooterBottom">

                    {/* caption box component */}
                    <PostCardCaption
                        caption={caption}
                        user={user}
                        componentType="postCard"
                    />

                </div>

            </div>
        </>
    )
}

export default PostCardFooter;