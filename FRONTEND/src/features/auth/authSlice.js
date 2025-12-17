import { createSlice } from "@reduxjs/toolkit";

// initial state for auth slice
const initialState = {
    user: null,
    loading: false,
    error: null,
    successMessage: null,
    isAuthenticated: false,
};


// creating slice for auth 
const authSlice = createSlice({

    // name of the slice
    name: "auth",

    // initial state
    initialState,

    // reducers for the slice
    reducers: {

        // reducer function to clear error and success message
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        },

    },

});

// export reducer function
export const { clearMessages } = authSlice.actions;

// export authSlice reducer
export default authSlice.reducer;


