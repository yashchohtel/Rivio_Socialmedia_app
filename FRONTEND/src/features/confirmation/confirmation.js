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
        openConfirmModal: (state, action) => {
            state.isOpen = true;
            state.message = action.payload.message;
            state.meta = action.payload.meta;
        },

        // close confirm modal
        closeConfirmModal: (state) => {
            state.isOpen = false;
            state.message = "";
            state.meta = {};
        },

    },

});

// export slice actions
export const { openConfirmModal, closeConfirmModal } = confirmSlice.actions;
export default confirmSlice.reducer;