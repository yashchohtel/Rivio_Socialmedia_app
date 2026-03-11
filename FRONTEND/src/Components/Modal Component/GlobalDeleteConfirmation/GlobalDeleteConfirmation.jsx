import React from 'react'
import './globalDeleteConfirmation.css'
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteConfirmModal } from '../../../features/confirmation/confirmationSlice';
import { deleteComment, deleteReply } from '../../../features/comment/commentThunk';
import { updatePostCommentsCount } from '../../../features/posts/postSlice';

const GlobalDeleteConfirmation = () => {

    // initilize user diapatch
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // get confirm data form confirm state
    const { isOpen, message, meta, } = useSelector((state) => state.confirm);

    // comment to be deleted (save to resotre if api fails)
    const deletedComment = useSelector((state) =>
        meta?.postId ? state.comment.commentsByPostId[meta.postId]?.comments.find(c => c._id === meta.commentId) : null
    );

    // reply to be deleted (save to resotre if api fails)
    const deletedReply = useSelector((state) => meta?.postId && meta?.commentId && meta?.replyId
        ? state.comment.commentsByPostId[meta.postId]?.comments.find(c => c._id === meta.commentId)?.replies?.find(r => r._id === meta.replyId)
        : null
    );

    /* -------------------------------------- */

    // jab tak isOpen false hai, kuch render mat karo
    if (!isOpen) return null;

    /* -------------------------------------- */

    // close modal
    const handleModalClose = () => {
        dispatch(closeDeleteConfirmModal());
    };

    /* -------------------------------------- */

    const handleConfirm = () => {

        // delete comment
        if (meta.action === "deleteComment") {

            // ecrement comment count optimisticlly
            const totalRepliesCount = 1 + (deletedComment?.replies?.length || 0);
            dispatch(updatePostCommentsCount({ postId: meta.postId, incrementBy: -totalRepliesCount }));

            // delete comment from database
            dispatch(deleteComment({ commentId: meta.commentId, postId: meta.postId, deletedComment })).unwrap().catch(() => {
                dispatch(updatePostCommentsCount({ postId: meta.postId, incrementBy: totalRepliesCount }));
            });;

        }

        // delete reply
        if (meta.action === "deleteReply") {

            // update comment count on replie deletion
            dispatch(updatePostCommentsCount({ postId: meta.postId, incrementBy: -1 }));

            // dispatch delete replay
            dispatch(deleteReply({ commentId: meta.commentId, replyId: meta.replyId, postId: meta.postId, deletedReply })).unwrap().catch(() => {
                dispatch(updatePostCommentsCount({ postId: meta.postId, incrementBy: 1 }));
            });

        }

        // close modal
        handleModalClose();

    }

    return (

        <>

            {/* delete confirmaiton overlay */}
            <div className="deleteConfirmationOverlay"
                onClick={() => handleModalClose()}
            >

                {/* confirmaitonbox */}
                <div className="confirmaitonbox"
                    onClick={(e) => e.stopPropagation()}
                >

                    {/* action message */}
                    <h2>{message}</h2>

                    <div className="divider"></div>

                    {/* delete */}
                    <button className="discardBtn"
                        onClick={() => handleConfirm()}
                    >
                        Delete
                    </button>

                    <div className="divider"></div>

                    {/* cancle */}
                    <button className="cancelBtn" onClick={handleModalClose}>
                        Cancel
                    </button>

                </div>

            </div >

        </>

    )

}

export default GlobalDeleteConfirmation;