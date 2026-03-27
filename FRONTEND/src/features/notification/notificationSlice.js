import { createSlice } from "@reduxjs/toolkit";
import { deleteAllNotifications, deleteNotification, getAllNotifications, getUnreadNotificationCount } from "./notificationThunk";

// initial state for comment slice
const initialState = {
    notifications: [], // array to store notifications data
    unreadCount: 0, // count to show on 
    notificationLoading: false, // to show loading
    error: null, // error message
}

// creating slice for notifications
const notificationSlice = createSlice({

    // name of the slice
    name: "notification",

    // initial state
    initialState,

    // reducers for the slice
    reducers: {

        // reducer to increment unreadCount when notificaion recivied
        incrementUnreadCount: (state) => {
            state.unreadCount += 1;
        },

        // reducer to decrement unread count when notificaion deleted
        decrementUnreadCount: (state) => {
            if (state.unreadCount > 0) {
                state.unreadCount -= 1;
            }
        },

        // reducer to set unreadCount zero
        unreadCountZero: (state) => {
            state.unreadCount = 0;
        },

        // reducer to add notificain from socket
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload); // sabse upar add karo
        }

    },

    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // GET UNREAD NOTIFICATION COUNT
            .addCase(getUnreadNotificationCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload.unreadCount;
            })
            .addCase(getUnreadNotificationCount.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // GET ALL NOTIFICAION RELATED TO THE USER
            .addCase(getAllNotifications.pending, (state) => {
                state.notificationLoading = true;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.notificationLoading = false;
                state.notifications = action.payload.optimizedNotificationData;
                state.unreadCount = 0;
            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.notificationLoading = false;
                state.error = action.payload;
            })

            // DELETE NOTIFICAION
            .addCase(deleteNotification.pending, (state, action) => {

                // get notification id from meta arg
                const { notificationId } = action.meta.arg;

                // remove notification optimistacly
                state.notifications = state.notifications.filter(n => n._id !== notificationId);

            })
            .addCase(deleteNotification.rejected, (state, action) => {

                // get data from action payload
                const { deletedNotification, index } = action.payload;

                // rollback - insexrt the notifian from where it was if api fails
                if (deletedNotification && index !== -1) {
                    state.notifications.splice(index, 0, deletedNotification);
                }

            })

            // DELETE ALL NOTIFICATIONS
            .addCase(deleteAllNotifications.pending, (state) => {

                // clear all notifications optimistically
                state.notifications = [];

            })
            .addCase(deleteAllNotifications.rejected, (state, action) => {

                // restore all notifications if failed
                state.notifications = action.payload.deletedNotifications;

            })

    }

})

// export reducer function
export const { incrementUnreadCount, decrementUnreadCount, unreadCountZero, addNotification } = notificationSlice.actions;

// export notificationSlice reducer
export default notificationSlice.reducer;