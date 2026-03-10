import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    isOpen: false, // global delete confirmation modal open/close state
    message: "", // message for modal
    meta: {}, // meta for delete action
};

// create confirm slice
const confirmSlice = createSlice({

    // name
    name: 'confirm',

    // initial state
    initialState,

    // reducers
    reducers: {

        // open confirm modal
        openDeleteConfirmModal: (state, action) => {

            // open modal
            state.isOpen = true;

            // set message
            state.message = action.payload.message;

            // set meta data
            state.meta = action.payload.meta;
            
        },

        // close confirm modal
        closeDeleteConfirmModal: (state) => {

            // close modal
            state.isOpen = false;

            // clar message
            state.message = "";

            // clear meta data
            state.meta = {};
        },

    },

});

// export slice actions
export const { openDeleteConfirmModal, closeDeleteConfirmModal } = confirmSlice.actions;
export default confirmSlice.reducer;