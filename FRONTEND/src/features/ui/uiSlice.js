import { createSlice } from "@reduxjs/toolkit";

// initial state for ui slice
const initialState = {
    feedActionOptionModalActive: false,
    selectedPostId: null, // optional but useful
};

// creating ui slice
const uiSlice = createSlice({

    // name 
    name: "ui",

    // initial state
    initialState,

    // reducers
    reducers: {

        // to open feed action option modal and set selected post id
        openFeedActionOption: (state, action) => {

            // opend feed action option modal
            state.feedActionOptionModalActive = true;

            // set selected post id
            state.selectedPostId = action.payload || null;
        },
        

        // to close feed action option modal and clear selected post id
        closeFeedActionOption: (state) => {

            // close feed action option modal
            state.feedActionOptionModalActive = false;

            // clear selected post id
            state.selectedPostId = null;
        },

    },

});


// export actions 
export const {openFeedActionOption, closeFeedActionOption} = uiSlice.actions;

// export the reducer
export default uiSlice.reducer;