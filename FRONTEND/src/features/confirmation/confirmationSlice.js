import { createSlice } from '@reduxjs/toolkit';

// initial state
const initialState = {
    isOpen: false,
    message: "",
    meta: {},
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
            state.isOpen = false;
            state.message = "";
            state.meta = {};
        },

    },

});

// export slice actions
export const { openDeleteConfirmModal, closeDeleteConfirmModal } = confirmSlice.actions;
export default confirmSlice.reducer;