import { createSlice } from "@reduxjs/toolkit";
import { getAllNotifications, getUnreadNotificationCount } from "./notificationThunk";

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

    }

})

// export reducer function
export const { incrementUnreadCount, decrementUnreadCount } = notificationSlice.actions;

// export notificationSlice reducer
export default notificationSlice.reducer;