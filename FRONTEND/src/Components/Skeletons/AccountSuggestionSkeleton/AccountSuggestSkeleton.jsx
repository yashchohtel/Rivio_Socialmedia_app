import React from 'react'
import "./accountSuggestSkeleton.css"

const AccountSuggestSkeleton = ({ isFirst }) => {

    return (
        <>

            {/* account sugestion skeleton */}
            <div className={`SuggestAccSkeleton ${isFirst ? "firstSkeleton" : ""}`}>

                {/* account avatar */}
                <div className="accAvatar"></div>

                {/* account data */}
                <div className="accLine">
                    <div className="accLine1"></div>
                    <div className="accLine2"></div>
                </div>

            </div>

        </>
    )

}

export default AccountSuggestSkeleton;