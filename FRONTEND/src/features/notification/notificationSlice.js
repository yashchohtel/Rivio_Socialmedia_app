import { createSlice } from "@reduxjs/toolkit";
import { deleteNotification, getAllNotifications, getUnreadNotificationCount } from "./notificationThunk";

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

                // re enter that notification if deletion fails
                state.notifications.unshift(action.payload.deletedNotification);

            })

    }

})

// export reducer function
export const { incrementUnreadCount, decrementUnreadCount, addNotification } = notificationSlice.actions;

// export notificationSlice reducer
export default notificationSlice.reducer;