import React, { useState } from 'react'
import './notificationModal.css'
import NotificationSkeleton from '../../Skeletons/NotificationSkeleton/NotificationSkeleton'
import { useSelector } from 'react-redux';
import { IoMdClose } from "react-icons/io";
import NotificationItem from './NotificationItem';

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

    /* -------------------------------------- */

    // notification filtered according to time (today, this week, earlier)

    // current date
    const now = new Date();

    // todays srart (mid night 12am)
    const todayStart = new Date(now);

    // setting today date at midnight 12 am
    todayStart.setHours(0, 0, 0, 0);

    // seven days ago date
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    // todays notifications
    const todayNotifications = filteredNotifications.filter(n => new Date(n.createdAt) >= todayStart);

    // this week notifications  
    const thisWeekNotifications = filteredNotifications.filter(n =>
        new Date(n.createdAt) >= sevenDaysAgo && new Date(n.createdAt) < todayStart
    );

    // earlierNotifications 
    const earlierNotifications = filteredNotifications.filter(n =>
        new Date(n.createdAt) < sevenDaysAgo
    );

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

                {/* not notification message */}
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

                {/* no comment activity message */}
                {!notificationLoading && activeTab === 'comments' && filteredNotifications.length === 0 && (
                    <p className="notificationMessage">No comment activity yet</p>
                )}

                {/* today notifications */}
                {todayNotifications.length > 0 && (
                    <>
                        <section className="notificationsContainer">

                            {/* notification sub heading */}
                            <h3 className='notiSubHeading'>today</h3>

                            {/* notificationItem */}
                            {todayNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    closeModal={closeModal} // to close modal
                                />
                            ))}

                        </section>

                    </>
                )}

                {/* this week notifications */}
                {thisWeekNotifications.length > 0 && (
                    <>

                        {/* notification rule */}
                        <div className="notirule"></div>

                        <section className="notificationsContainer">

                            {/* notification sub heading */}
                            <h3 className='notiSubHeading'>This week</h3>

                            {/* notificationItem */}
                            {thisWeekNotifications.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    closeModal={closeModal} // to close modal
                                />
                            ))}

                        </section>

                    </>
                )}

                {/* Earlier notifications */}
                {earlierNotifications.length > 0 && (
                    <>
                        {/* notification rule */}
                        <div className="notirule"></div>

                        <section className="notificationsContainer">

                            {/* notification sub heading */}
                            <h3 className='notiSubHeading'>Earlier</h3>

                            {/* notificationItem */}
                            {earlierNotifications.map((notification) => (
                                <NotificationItem
                                    notification={notification}
                                    key={notification._id}
                                    closeModal={closeModal} // to close modal
                                />
                            ))}

                        </section>

                    </>

                )}

            </div>

        </>
    )
}

export default NotificationModal;