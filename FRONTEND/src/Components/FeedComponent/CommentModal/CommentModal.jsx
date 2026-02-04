import React from 'react'
import './commentModal.css'
import { closeCommentModal } from '../../../features/comment/commentSlice';
import { useDispatch, useSelector } from 'react-redux';

const CommentModal = ({ activePostId }) => {

    console.log(activePostId);
    
    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    // posts from redux store
    const { posts } = useSelector((state) => state.post);

    console.log(posts);
    
    // get post data for active post id
    const post = posts.find((p) => p._id === activePostId);

    console.log(post);

    /* -------------------------------------- */

    // function to close comment modal
    const handleCloseModal = () => {
        dispatch(closeCommentModal());
    }

    return (
        <>
            {/* commentModalOverLay */}
            <div className="commentModalOverLay"
                onClick={handleCloseModal}
            >

                {/* commentModal */}
                <div
                    className="commentModal"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {activePostId}
                </div>

            </div>
        </>
    )
}

export default CommentModal