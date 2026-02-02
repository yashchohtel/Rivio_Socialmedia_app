import React from 'react'
import './postCard.css'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import PostCardHeader from '../PostCardHeader/PostCardHeader';
import PostCardFooter from '../PostCardFooter/PostCardFooter';

const PostCard = ({ post }) => {

    // destructure post data
    const { _id, user, createdAt, location, isOwnPost, isFollowing, media, commentsCount, likesCount, sharesCount, isLiked, isBookmarked } = post;

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
                <div className="imageContainer">

                    {/* image slider */}
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                    >

                        {media.map((item) => (
                            <SwiperSlide key={item._id}>
                                <img
                                    src={item.url}
                                    alt="post"
                                    loading="lazy"
                                />
                            </SwiperSlide>
                        ))}

                    </Swiper>

                </div>

                {/* post bottom */}
                <PostCardFooter
                    commentsCount={commentsCount}
                    likesCount={likesCount}
                    sharesCount={sharesCount}
                    isLiked={isLiked}
                    postId={_id}
                    isBookmarked={isBookmarked}
                />

            </div>
        </>
    )
};

export default React.memo(PostCard);