import React from 'react'
import "./discardModal.css"

const DiscardModal = ({ closeDiscardModal, handleDiscardClick }) => {
    return (
        <>
            {/* discard overlay */}
            <div className="discardOverlay" onClick={closeDiscardModal}>

                {/* discard modal */}
                <div className="discardModal" onClick={(e) => e.stopPropagation()}>

                    <h2>Discard post?</h2>
                    <p>If you leave, your edits won't be saved.</p>

                    <div className="divider"></div>

                    <button className="discardBtn" onClick={handleDiscardClick}>
                        Discard
                    </button>

                    <div className="divider"></div>

                    <button className="cancelBtn" onClick={closeDiscardModal}>
                        Cancel
                    </button>

                </div>

            </div>
        </>

    )
}

export default DiscardModal