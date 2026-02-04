import { createSlice } from "@reduxjs/toolkit";

// initial state for comment slice
const initialState = {
    activePostId: null, // to store active post id for comment modal
    isCommentModalOpen: false, // to check if comment modal is open
};

// creating slice for auth
const commentSlice = createSlice({

    // name of the slice
    name: "comment",

    // initial state
    initialState,

    // reducers for the slice
    reducers: {

        // function to open comment modal
        openCommentModal: (state, action) => {
            
            // set active post id and open modal
            state.activePostId = action.payload;

            // set modal open status to true
            state.isCommentModalOpen = true;
        },

        // function to close comment modal
        closeCommentModal: (state) => {

            // clear active post id 
            state.activePostId = null;

            // close modal
            state.isCommentModalOpen = false;
        },

    },

});

// export reducer function
export const { openCommentModal, closeCommentModal } = commentSlice.actions;

// export commentSlice reducer
export default commentSlice.reducer;