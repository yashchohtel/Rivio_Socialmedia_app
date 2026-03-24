import React from 'react'
import "./notificationSkeleton.css";

const NotificationSkeleton = () => {

    return (

        <>

            {/* skeleton tabs */}
            <div className="tabs">
                <div className="tab"></div>
            </div>

            {Array.from({ length: 10 }).map((_, index) => (
                <div className="notiSkul" key={index}>

                    {/* avatar */}
                    <div className="avator"></div>

                    {/* info */}
                    <div className="info">
                        <div className="infoLine1"></div>
                        <div className="infoLine2"></div>
                    </div>

                    {/* thumbnail */}
                    <div className="thumbnail"></div>

                </div>
            ))}

        </>

    )
}

export default NotificationSkeleton