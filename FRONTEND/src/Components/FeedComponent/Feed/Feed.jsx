/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react'
import './feed.css'
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../PostCard/PostCard';
import { loadFeed } from '../../../features/posts/postThunk';
import { ImSpinner8 } from "react-icons/im";
import FeedSkeleton from '../../Skeletons/FeedSkeleton/FeedSkeleton';
import CommentModal from '../CommentModal/CommentModal';
import FeedActionOptionModal from '../FeedActionOptionModal/FeedActionOptionModal';

const Feed = () => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    // Get auth loading state from Redux store
    const { posts, feedLoading, hasMore, cursor, success, phase, message } = useSelector((state) => state.post);
    
    // Get comment initial state from Redux store
    const { activePostId, isCommentModalOpen } = useSelector((state) => state.comment);

    /* -------------------------------------- */

    // state to make feed action option modal active
    const [feedActionOptionModalActive, setFeedActionOptionModalActive] = useState(false);

    // to open feed action option modal
    const openFeedActionOption = useCallback(() => {
        setFeedActionOptionModalActive(true);
    }, [])


    // to open feed action option modal
    const closeFeedActionOption = useCallback(() => {
        setFeedActionOptionModalActive(false);
    }, [])

    /* -------------------------------------- */

    // effect to implement infinite scroll
    useEffect(() => {

        // accesing contentOutlet(scrollable component) to implement infinite scroll feature
        const container = document.querySelector(".contentOutlet");

        // if no container stop execution
        if (!container) return;

        // handles scroll function
        const handleScroll = () => {

            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            // drigger dispatch when reaching to bottom
            if (scrollTop + clientHeight >= scrollHeight - 200 && hasMore && !feedLoading) {
                dispatch(loadFeed(cursor));
            }

        };

        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };

    }, [dispatch, cursor, hasMore, feedLoading]);

    /* -------------------------------------- */

    // load content for feed for first time (initial loading)
    useEffect(() => {

        // dispatch loadFeed thunk
        if (posts.length === 0) {
            dispatch(loadFeed(null));
        }

    }, []);

    return (

        <>

            {/* show skeleton when post is loading */}
            {feedLoading && posts.length === 0 && (
                Array.from({ length: 6 }).map((_, i) => (
                    <FeedSkeleton key={i} />
                ))
            )}

            {/* feed content */}
            {posts && posts.map((post) => (
                <PostCard
                    key={post._id} // unique key
                    post={post} // post data
                    openFeedActionOption={openFeedActionOption} // pass open feed action option modal handler to post card
                />
            ))}

            {/* comment modal for gloal comment system */}
            {isCommentModalOpen && (
                <CommentModal
                    activePostId={activePostId} // pass active post id to comment modal
                    openFeedActionOption={openFeedActionOption} // pass open feed action option modal handler to comment modal
                />
            )}

            {/* feed action option modal */}
            {feedActionOptionModalActive && (
                <FeedActionOptionModal
                    closeFeedActionOption={closeFeedActionOption} // feed action option modal close handler
                />
            )}

            {/* feed loading spinner */}
            {feedLoading && (
                <div className="feedLoading">
                    <ImSpinner8 />
                </div>
            )}

            {/* if no more post */}
            {!hasMore && (
                <p className='noMoreText'>No more posts!</p>
            )}

        </>

    )
}

export default Feed;
