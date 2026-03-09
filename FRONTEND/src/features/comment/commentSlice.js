import { createSlice } from "@reduxjs/toolkit";
import { addComment, getCommentsForPost, replyOnComment } from "./commentThunk";

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

        // add optimistic comment
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

        // add real time comment data from socket
        addCommentFromSocket: (state, action) => {

            // extract postId and comment from payload
            const { postId, comment } = action.payload;

            // ensure post exists in state
            if (!state.commentsByPostId[postId]) {
                state.commentsByPostId[postId] = {
                    comments: [],
                    count: 0
                };
            }

            // prevent duplicate if current user already added optimistically
            const exists = state.commentsByPostId[postId].comments.some((c) => {
                return c._id.toString() === comment._id.toString();
            });

            if (!exists) {
                state.commentsByPostId[postId].comments.unshift(comment);
                state.commentsByPostId[postId].count += 1;
            }
        },

        // add comment's reply optimistic
        addReplyOptimistic: (state, action) => {

            // destructure action.paylod data
            const { postId, commentId, tempReply } = action.payload
            
            // get post's comments by post id
            const postComments = state.commentsByPostId[postId];
            if (!postComments) return;

            // find target comment
            const comment = postComments.comments.find(c => c._id === commentId);
            if (!comment) return;

            // ensure comment's have replies array
            if (!comment.replies) comment.replies = [];

            // add comment on top of replies
            comment.replies.push(tempReply);

            // increase replies count
            comment.repliesCount += 1;

        },

        // add reply from socket
        addReplyFromSocket: (state, action) => {
            
            // extract data from action payload
            const { postId, commentId, reply } = action.payload;

            // find post comments
            const postComments = state.commentsByPostId[postId];
            if (!postComments) return;

            // find posts
            const comment = postComments.comments.find(c => c._id === commentId);
            if (!comment) return;

            // find replie exist or not
            const exists = comment.replies.some(r => r._id === reply._id);

            // if not exists add replies
            if (!exists) {
                comment.replies.push(reply);
                comment.repliesCount += 1;
            }

        }

    },

    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // GET COMMENTS FOR POST
            .addCase(getCommentsForPost.pending, (state) => {

                // start comment loading
                state.commentLoading = true;

            })
            .addCase(getCommentsForPost.fulfilled, (state, action) => {

                // stop loading
                state.commentLoading = false;

                // destructure payload
                const { postId, count, comments } = action.payload;

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

                // get postId from comment data
                const postId = comment.post;

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
                postComments.comments = postComments.comments.filter(
                    (c) => c.isOptimistic !== true
                );

                // decrement comment count for the post
                postComments.count -= 1;

            })

            // ADD REPLY
            .addCase(replyOnComment.fulfilled, (state, action) => {

                // extract data from payload
                const { postId, commentId, reply } = action.payload;

                // find comments of post
                const postComments = state.commentsByPostId[postId];
                if (!postComments) return;

                // find target comment
                const comment = postComments.comments.find((c) => c._id === commentId);
                if (!comment) return;

                // find optimistic reply
                const index = comment.replies.findIndex(r => r.isOptimistic);

                // replace real reply with optimistic reply
                if (index !== -1) {
                    comment.replies[index] = reply;
                }

            })
            .addCase(replyOnComment.rejected, (state, action) => {

                // get datafrom meta argument
                const { postId, commentId } = action.meta.arg;

                // find post comment
                const postComments = state.commentsByPostId[postId];
                if (!postComments) return;

                // find comment
                const comment = postComments.comments.find((c) => c._id === commentId);
                if (!comment) return;

                // remove optimistic reply
                comment.replies = comment.replies.filter(r => !r.isOptimistic);

                // decrement replies count 
                comment.repliesCount -= 1;

            })
    },

});

// export reducer function
export const { openCommentModal, closeCommentModal, addCommentOptimistic, addCommentFromSocket, addReplyOptimistic, addReplyFromSocket } = commentSlice.actions;

// export commentSlice reducer
export default commentSlice.reducer;