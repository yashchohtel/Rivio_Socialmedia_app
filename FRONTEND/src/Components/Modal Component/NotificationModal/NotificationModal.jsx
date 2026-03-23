import React from 'react'
import './notificationModal.css'
import NotificationSkeleton from '../../Skeletons/NotificationSkeleton/NotificationSkeleton'

const NotificationModal = () => {
    
    return (
        <>
            <div
                className="NotificationModal"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <h1 className='notificationHead'>Notifications</h1>

                {/* notification loading skeleton */}
                <NotificationSkeleton/>

            </div>
        </>
    )
}

export default NotificationModal