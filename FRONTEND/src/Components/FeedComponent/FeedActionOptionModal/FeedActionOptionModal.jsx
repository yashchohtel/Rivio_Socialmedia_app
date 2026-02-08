import React from 'react'
import './feedActionOptionModal.css'

const FeedActionOptionModal = ({ closeFeedActionOption }) => {
    return (
        <>
            {/* feed action option modal */}
            <div className="FeedActionOptionModal"
                onClick={() => closeFeedActionOption()}
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

export default FeedActionOptionModal