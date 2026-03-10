import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import postReducer from '../features/posts/postSlice.js';
import commentReducer from '../features/comment/commentSlice.js';
import confirmReducer from '../features/confirmation/confirmationSlice.js';

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

    },

});

// export store for glocal use
export default store;