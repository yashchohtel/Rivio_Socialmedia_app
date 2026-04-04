import React from 'react'
import './singlePost.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSinglePost } from '../../features/posts/postThunk';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../Components/FeedComponent/PostCard/PostCard';
import AccountSuggestion from '../../Components/AccountSuggestion/AccountSuggestion';
import FeedSkeleton from '../../Components/Skeletons/FeedSkeleton/FeedSkeleton';

const SinglePost = () => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // get patameter data from url
    const { postId } = useParams();

    /* -------------------------------------- */

    // get post data from redux store
    const { postsById, singlePostId, singlePostLoading } = useSelector(state => state.post);

    // get post data for single post id
    const post = postsById[singlePostId];

    /* -------------------------------------- */

    // effect to get single post
    useEffect(() => {

        // dispatcch getSinglePost
        dispatch(getSinglePost(postId));

    }, [postId]);

    /* -------------------------------------- */

    // post card skeleton loading
    if (singlePostLoading) {

        return (

            <div className="singePostPage">

                <div className="singlePostContentCont">

                    <div className="postCardCont">
                        <FeedSkeleton />
                    </div>

                    <div className="accountSuggestionCont">
                        <AccountSuggestion />
                    </div>

                </div>

            </div>

        );
    }

    // if single post is null do not render component
    if (!post) return null;

    /* -------------------------------------- */

    return (

        <>

            {/* single post page */}
            <div className="singePostPage">

                {/* single post content container */}
                <div className="singlePostContentCont">

                    {/* post card container */}
                    <div className="postCardCont">

                        {/* post card component */}
                        <PostCard
                            post={post} // post data                
                        />

                    </div>

                    {/* suggestion contaienr */}
                    <div className="accountSuggestionCont">

                        {/* account suggestion component */}
                        <AccountSuggestion />

                    </div>

                </div>

            </div>

        </>

    )
}

export default SinglePost;

