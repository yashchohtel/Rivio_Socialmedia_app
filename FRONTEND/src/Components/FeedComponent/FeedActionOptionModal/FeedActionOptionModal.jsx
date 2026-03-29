import React from 'react'
import './feedActionOptionModal.css'
import { useDispatch, useSelector } from 'react-redux'; 
import { closeFeedActionOption } from '../../../features/ui/uiSlice';

const FeedActionOptionModal = () => {

    // state to make feed action option modal active getting from ui slice
    const { feedActionOptionModalActive } = useSelector((state) => state.ui);

    /* -------------------------------------- */

    // configure dispatch use to dispatch actions
    const dispatch = useDispatch();

    /* -------------------------------------- */

    // if not open then return null (do not render component)
    if (!feedActionOptionModalActive) return null;

    /* -------------------------------------- */

    // function to close feed action option modal
    const handleCloseModal = () => {

        // dispatch close feed action option modal action
        dispatch(closeFeedActionOption());

    }

    return (

        <>
            {/* feed action option modal */}
            <div className="FeedActionOptionModal"
                onClick={() => handleCloseModal()}
            >

                {/* feed action option */}
                <div className="feedActionOption">

                    <p className="actionOption"> block </p>
                    <p className="actionOption"> unfollow </p>
                    <p className="actionOption"> go to profile </p>
                    <p className="actionOption"> save post </p>
                    <p className="actionOption"> copy link </p>
                    <p className="actionOption"> cancle </p>

                </div>

            </div>

        </>

    )

}

export default FeedActionOptionModal;