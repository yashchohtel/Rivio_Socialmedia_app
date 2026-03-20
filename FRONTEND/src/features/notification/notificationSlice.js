import { createSlice } from "@reduxjs/toolkit";

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



    }

})

// export reducer function
export const { openCommentModal } = notificationSlice.actions;

// export notificationSlice reducer
export default notificationSlice.reducer;