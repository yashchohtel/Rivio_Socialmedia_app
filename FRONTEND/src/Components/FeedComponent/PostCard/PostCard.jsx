import React, { useCallback, useState } from 'react'
import './postCard.css'

import PostCardHeader from '../PostCardHeader/PostCardHeader';
import PostCardFooter from '../PostCardFooter/PostCardFooter';
import FeedImageContainer from '../FeedImageContainer/FeedImageContainer';

const PostCard = ({ post, openFeedActionOption }) => {

    // destructure post data
    const { _id, user, createdAt, location, isOwnPost, isFollowing, media, commentsCount,sharesCount, likesCount, isLiked, isBookmarked, bookmarkStatus, caption } = post;

    // console.log(_id);
    
    /* -------------------------------------- */

    // state to make bookmark toast active (on image container)
    const [bookmarkActive, setBookmarkActive] = useState(false);

    // handle bookmark active
    const handleBookmarkActive = useCallback(() => {
        setBookmarkActive(true);
    }, []);

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
                    openFeedActionOption={openFeedActionOption} // to open feed action option modal
                    componentType="postCard"
                />

                {/* post body */}
                <FeedImageContainer
                    media={media}
                    bookmarkActive={bookmarkActive}
                    bookmarkStatus={bookmarkStatus}
                    setBookmarkActive={setBookmarkActive}
                    componentType="postCard"
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