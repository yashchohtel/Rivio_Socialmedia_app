import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';

// configure store with 
const store = configureStore({

    // add reducers here
    reducer: {

        // auth reducer
        auth: authReducer,

    },

});

// export store for glocal use
export default store;