import React, { useEffect } from 'react'
import './feedImageContainer.css'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from "swiper/modules";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const FeedImageContainer = ({ media, bookmarkStatus, bookmarkActive, setBookmarkActive, componentType }) => {

    // hide bok mark toast
    useEffect(() => {

        // if component type not equal to post card retur
        if(componentType !== "postCard") return

        if (!bookmarkStatus) return;

        setBookmarkActive(true);

        const timer = setTimeout(() => {
            setBookmarkActive(false);
        }, 2000);

        return () => clearTimeout(timer);

    }, [bookmarkStatus]);

    return (

        <>

            {/* post body */}
            <div className={`feedImageContainer ${componentType === "postCard" ? "feedImgBorder" : ""}`}>

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
                                className={`${componentType === "commentModal" ? "cover" : ""}`}
                                src={item.url}
                                alt="post"
                                loading="lazy"
                            />
                        </SwiperSlide>
                    ))}

                </Swiper>


                {/* post book mark sucess ui only show on post card component*/}
                {componentType === "postCard" && (

                    <div className={`bookmark-toast ${bookmarkActive ? "active" : ""}`}>

                        {/* mesage text */}
                        <span className='toastMsg'>Your item has been {bookmarkStatus}</span>

                        {/* link */}
                        <Link to="/app/bookmark" className="view-saved">  View your saved posts </Link>

                    </div>
                )}

            </div>
        </>
    )
}

export default FeedImageContainer