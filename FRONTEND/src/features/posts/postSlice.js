import { createSlice } from "@reduxjs/toolkit";
import { createPost } from "./postThunk";


// initial state for auth slice
const initialState = {
    posts: [],
    postLoading: false,
    success: false,
    message: null,
    error: null,
};


// creating slice for auth 
const postSlice = createSlice({

    // name of the slice
    name: "post",

    // initial state
    initialState,

    // reducers for the slice
    reducers: {

        // reducer function to clear error and success message
        clearMessages: (state) => {
            state.error = null;
            state.message = null;
            state.success = false;
        },

    },

    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // CREATE POST
            .addCase(createPost.pending, (state) => {
                state.postLoading = true;
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                console.log(action.payload);
                state.postLoading = false;
                state.success = true;
                state.message = action.payload?.message || "Post created successfully";
            })
            .addCase(createPost.rejected, (state, action) => {
                state.postLoading = false;
                state.success = false;
                state.error = action.payload || "Post creation failed";
            });

    }

});

// export reducer function
export const { clearMessages } = postSlice.actions;

// export postSlice reducer
export default postSlice.reducer;