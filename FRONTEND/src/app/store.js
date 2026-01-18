import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import postReducer from '../features/posts/postSlice.js'

// configure store with 
const store = configureStore({

    // add reducers here
    reducer: {

        // auth reducer
        auth: authReducer,

        // post reducer
        post: postReducer,

    },

});

// export store for glocal use
export default store;