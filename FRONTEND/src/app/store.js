import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import postReducer from '../features/posts/postSlice.js';
import commentReducer from '../features/comment/commentSlice.js';
import confirmReducer from '../features/confirmation/confirmationSlice.js';
import notificationReducer from '../features/notification/notificationSlice.js'
import uiReducer from "../features/ui/uiSlice.js";

// configure store with 
const store = configureStore({

    // add reducers here
    reducer: {

        // auth reducer
        auth: authReducer,

        // post reducer
        post: postReducer,

        // comment reducer
        comment: commentReducer,

        // confirm reducer
        confirm: confirmReducer,

        // notification reducer
        notification: notificationReducer,

        // ui reducer
        ui: uiReducer,

    },

});

// export store for glocal use
export default store;