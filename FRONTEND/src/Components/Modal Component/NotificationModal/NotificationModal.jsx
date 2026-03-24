import React, { useState } from 'react'
import './notificationModal.css'
import NotificationSkeleton from '../../Skeletons/NotificationSkeleton/NotificationSkeleton'
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";

const NotificationModal = ({ closeModal }) => {

    /* -------------------------------------- */

    // getting notifiicaon data from notificaon state
    const { notifications, notificationLoading } = useSelector(state => state.notification);

    /* -------------------------------------- */

    // state to store active tab
    const [activeTab, setActiveTab] = useState("all");

    /* -------------------------------------- */

    // types of comments
    const commentTypes = ["POST_COMMENT", "COMMENT_REPLY", "COMMENT_LIKE", "REPLY_LIKE"];

    // filtered notificasions 
    const filteredNotifications = activeTab === 'comments'
        ? notifications.filter(n => commentTypes.includes(n.type))
        : notifications;

    console.log(filteredNotifications);

    /* -------------------------------------- */

    return (
        <>
            <div
                className="NotificationModal"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >

                {/* modal close button */}
                <button
                    className="modalClose"
                    onClick={() => closeModal()}
                >
                    <IoMdClose />
                </button>

                {/* notificaiton heading */}
                <h1 className='notificationHead'>Notifications</h1>

                {/* notification loading skeleton */}
                {notificationLoading && (
                    <NotificationSkeleton />
                )}

                {/* not notification messaeg */}
                {!notificationLoading && notifications.length === 0 && (
                    <p className='notificationMessage'>No notifications</p>
                )}

                {/* notificaion filters button */}
                {!notificationLoading && notifications.length !== 0 && (
                    <div className="notificationFilterTab">

                        {/* all notificaion */}
                        <button
                            className={`filterBtn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </button>

                        {/* comments notificaion */}
                        <button
                            className={`filterBtn ${activeTab === 'comments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('comments')}
                        >
                            Comments
                        </button>

                    </div>
                )}

            </div>
        </>
    )
}

export default NotificationModal;