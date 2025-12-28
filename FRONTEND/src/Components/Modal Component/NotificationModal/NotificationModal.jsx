import React from 'react'
import './notificationModal.css'

const NotificationModal = () => {
    return (
        <>
            <div
                className="NotificationModal"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <h1>This is notification modal</h1>
            </div>
        </>
    )
}

export default NotificationModal