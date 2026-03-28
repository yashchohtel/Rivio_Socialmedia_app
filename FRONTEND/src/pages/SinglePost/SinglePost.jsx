import React from 'react'
import './singlePost.css'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getSinglePost } from '../../features/posts/postThunk';
import { clearSinglePost } from '../../features/posts/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../Components/FeedComponent/PostCard/PostCard';

const SinglePost = () => {

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // get patameter data from url
    const { postId } = useParams();

    /* -------------------------------------- */

    const { singlePost } = useSelector((state) => state.post);

    console.log(singlePost);

    /* -------------------------------------- */

    // effect to get single post
    useEffect(() => {

        // dispatcch getSinglePost
        dispatch(getSinglePost(postId));

        return () => {

            // clear single post from state
            dispatch(clearSinglePost());
        };

    }, [postId]);

    return (

        <>

            <PostCard
                post={singlePost} // post data
                // openFeedActionOption={openFeedActionOption} // pass open feed action option modal handler to post card
            />


        </>

    )
}

export default SinglePost