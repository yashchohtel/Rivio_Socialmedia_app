import React from 'react'
import './globalDeleteConfirmation.css'
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteConfirmModal } from '../../../features/confirmation/confirmationSlice';
import { deleteCommentOptimistic } from '../../../features/comment/commentSlice';

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

    console.log(deletedComment);
    
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

            // delete comment optimisticaly
            dispatch(deleteCommentOptimistic({ postId: meta.postId, commentId: meta.commentId }));

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