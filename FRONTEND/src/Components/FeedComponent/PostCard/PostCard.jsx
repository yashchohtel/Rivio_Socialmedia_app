import React, { useState } from 'react'
import './postCard.css'

import PostCardHeader from '../PostCardHeader/PostCardHeader';
import PostCardFooter from '../PostCardFooter/PostCardFooter';
import FeedImageContainer from '../FeedImageContainer/FeedImageContainer';

const PostCard = ({ post }) => {

    // destructure post data
    const { _id, user, createdAt, location, isOwnPost, isFollowing, media, commentsCount, likesCount, sharesCount, isLiked, isBookmarked, bookmarkStatus, caption } = post;
    
    /* -------------------------------------- */

    // state to make bookmark toast active
    const [bookmarkActive, setBookmarkActive] = useState(false);

    // handle bookmark active
    const handleBookmarkActive = () => {
        setBookmarkActive(true)
    }

    /* -------------------------------------- */

    return (
        <>

            {/* post Card */}
            <div className="postCard">

                {/* post card header */}
                <PostCardHeader
                    user={user} // user document
                    createdAt={createdAt}
                    location={location}
                    isOwnPost={isOwnPost}
                    isFollowing={isFollowing}
                />

                {/* post body */}
                <FeedImageContainer
                    media={media}
                    bookmarkActive={bookmarkActive}
                    bookmarkStatus={bookmarkStatus}
                    setBookmarkActive={setBookmarkActive}
                />

                {/* post bottom */}
                <PostCardFooter
                    postId={_id}
                    commentsCount={commentsCount}
                    likesCount={likesCount}
                    sharesCount={sharesCount}
                    isLiked={isLiked}
                    isBookmarked={isBookmarked}
                    handleBookmarkActive={handleBookmarkActive}
                    caption={caption}
                    user={user}
                />

            </div>
        </>
    )
};

export default React.memo(PostCard);