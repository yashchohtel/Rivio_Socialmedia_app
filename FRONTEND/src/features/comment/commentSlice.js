import { createSlice } from "@reduxjs/toolkit";
import { addComment, getCommentsForPost } from "./commentThunk";

// initial state for comment slice
const initialState = {
    activePostId: null, // to store active post id for comment modal
    isCommentModalOpen: false, // to check if comment modal is open
    commentLoading: false, // for loading comments for post
    error: null, // for error message
    commentsByPostId: {} // to store comments for each post, key is post id and value is array of comments
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

        // add optimistic add
        addCommentOptimistic: (state, action) => {

            // destructure payload
            const { postId, tempComment } = action.payload;

            if (!state.commentsByPostId[postId]) {
                state.commentsByPostId[postId] = {
                    comments: [],
                    count: 0
                };
            }

            // post comment optimistically to the top of the comment list for the post
            state.commentsByPostId[postId].comments.unshift(tempComment);

            // increment comment count for the post
            state.commentsByPostId[postId].count += 1;
        },

    },

    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // GET COMMENTS FOR POST
            .addCase(getCommentsForPost.pending, (state) => {
                state.commentLoading = true;
            })
            .addCase(getCommentsForPost.fulfilled, (state, action) => {

                // stop loading
                state.commentLoading = false;

                // destructure payload
                const { postId, comments, count } = action.payload;

                // update commentsByPostId with new comments - only store if comments exist
                if (count > 0) {
                    state.commentsByPostId[postId] = {
                        comments,
                        count
                    };
                }

            })
            .addCase(getCommentsForPost.rejected, (state) => {
                state.commentLoading = false;
            })

            // ADD COMMENT
            .addCase(addComment.fulfilled, (state, action) => {

                // get comment from payload
                const comment = action.payload.comment;

                console.log(comment);
                
                // get postId from comment data
                const postId = comment.post; // correct postId access

                // get comments for the post from state
                const postComments = state.commentsByPostId[postId];
                if (!postComments) return;

                // find index of the optimistic comment in the comments array using isOptimistic flag
                const index = postComments.comments.findIndex((c) => {
                    return c.isOptimistic === true;
                });

                // replace the optimistic comment with the actual comment data from backend using the index
                if (index !== -1) {
                    postComments.comments[index] = comment;
                }

            })
            .addCase(addComment.rejected, (state, action) => {

                // get postId from action meta
                const { postId } = action.meta.arg;

                // get comments for the post from state
                const postComments = state.commentsByPostId[postId];
                if (!postComments) return;

                // optimistic comment remove
                postComments.comments =
                    postComments.comments.filter(
                        (c) => c.isOptimistic !== true
                    );

                // decrement comment count for the post
                postComments.count -= 1;

            })
    },

});

// export reducer function
export const { openCommentModal, closeCommentModal, addCommentOptimistic } = commentSlice.actions;

// export commentSlice reducer
export default commentSlice.reducer;