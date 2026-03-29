import React from 'react'
import './singlePost.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSinglePost } from '../../features/posts/postThunk';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../Components/FeedComponent/PostCard/PostCard';
import AccountSuggestion from '../../Components/AccountSuggestion/AccountSuggestion';

const SinglePost = () => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // get patameter data from url
    const { postId } = useParams();

    /* -------------------------------------- */

    const { singlePost, singlePostLoading } = useSelector((state) => state.post);

    /* -------------------------------------- */

    // effect to get single post
    useEffect(() => {

        // dispatcch getSinglePost
        dispatch(getSinglePost(postId));

    }, [postId]);

    /* -------------------------------------- */

    // post card skeleton loading
    if (singlePostLoading) return <p>Loading...</p>;

    // if single post is null do not render component
    if (!singlePost) return null;

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
                            post={singlePost} // post data                
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

export default SinglePost

