import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./authThunk";

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


    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                console.log("er action" + action);

                state.loading = false;
                state.successMessage = action.payload.message;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {

                console.log("er action" + action);
                console.log(action);
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });

    },

});

// export reducer function
export const { clearMessages } = authSlice.actions;

// export authSlice reducer
export default authSlice.reducer;


