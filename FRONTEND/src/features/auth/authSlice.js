import { createSlice } from "@reduxjs/toolkit";
import { loadUser, loginUser, registerUser } from "./authThunk";

// initial state for auth slice
const initialState = {
    user: null,
    authLoading: true, // loader for load user for aap only
    formLoading: false, // for login ans signup loading
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

            // load user data and auth state
            .addCase(loadUser.pending, (state) => {
                state.authLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.successMessage = action.payload.message;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.authLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })

            // register user
            .addCase(registerUser.pending, (state) => {
                state.formLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.formLoading = false;
                state.successMessage = action.payload.message;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.formLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // login user
            .addCase(loginUser.pending, (state) => {
                state.formLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.formLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.successMessage = action.payload.message;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.formLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            });

    },

});

// export reducer function
export const { clearMessages } = authSlice.actions;

// export authSlice reducer
export default authSlice.reducer;


