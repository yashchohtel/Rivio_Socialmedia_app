import { createSlice } from "@reduxjs/toolkit";
import { createPost, handlePostBookmark, handlePostLike, loadFeed } from "./postThunk";

// initial state for post slice
const initialState = {
    posts: [],
    postLoading: false, // for creating post
    feedLoading: false, // for loading feed
    success: false, // for sucess flag
    hasMore: true, // for the feed
    cursor: null, // to get the next batch of posts for feed
    phase: null, // phase is for post uploading feature
    message: null, // message is for succes message
    error: null, // this is for erroe message
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
            state.phase = null;
        },

    },

    // extrareducers to handle async actions
    extraReducers: (builder) => {

        // add cases for async thunks here
        builder

            // CREATE POST
            .addCase(createPost.pending, (state) => {
                state.postLoading = true;
                state.phase = "started"
                state.error = null;
                state.message = null;
                state.success = false;
            })
            .addCase(createPost.fulfilled, (state, action) => {

                console.log(action.payload);

                state.postLoading = false;
                state.success = true;
                state.message = action.payload?.message || "Post created successfully";
                state.phase = "uploaded"

                if (action.payload?.formattedPost) {
                    state.posts.unshift(action.payload.formattedPost);
                }

            })
            .addCase(createPost.rejected, (state, action) => {
                state.postLoading = false;
                state.success = false;
                state.error = action.payload || "Post creation failed";                
            })

            // LOAD FEED
            .addCase(loadFeed.pending, (state) => {
                state.feedLoading = true;
                state.error = null;
                state.success = false;
                state.phase = "loadingFeed";
            })
            .addCase(loadFeed.fulfilled, (state, action) => {

                console.log(action.payload);

                state.feedLoading = false;
                state.success = true;
                state.phase = "feedLoaded";

                // extracting posts, nextCursor and hasMore flag from payload
                const { posts, nextCursor, hasMore } = action.payload;

                //  append posts in posts initial state for fead
                state.posts = [...state.posts, ...posts];

                // update cursor
                state.cursor = nextCursor;

                // if no more post
                state.hasMore = hasMore;

            })
            .addCase(loadFeed.rejected, (state, action) => {
                state.feedLoading = false;
                state.success = false;
                state.phase = "feedError";
                state.error = action.payload;
            })

            // LIKE POST
            .addCase(handlePostLike.pending, (state) => {

                // no loader - (optimistic UI already)
                state.error = null;

            })
            .addCase(handlePostLike.fulfilled, (state, action) => {

                // extract data from payload
                const { postId, liked, likesCount } = action.payload;

                // find the post which we are handlin like 
                const post = state.posts.find(p => p._id === postId);

                if (post) {
                    post.isLiked = liked;
                    post.likesCount = likesCount;
                }

            })
            .addCase(handlePostLike.rejected, (state, action) => {
                state.success = false;
                state.error = action.payload;
            })

            // BOOKMARK POST
            .addCase(handlePostBookmark.pending, (state, action) => {

                // getting post
                const post = state.posts.find(p => p._id === action.meta.arg);

                // setting 
                if (post) post.bookmarkLoading = true;

            })
            .addCase(handlePostBookmark.fulfilled, (state, action) => {

                // extract postId and bookMarked
                const { postId, bookmarked } = action.payload;

                // fubd posts
                const post = state.posts.find(p => p._id === postId);

                if (post) {
                    post.bookmarkLoading = false;
                    post.isBookmarked = bookmarked;
                    post.bookmarkStatus = bookmarked ? "saved" : "unsaved";
                }

            })
            .addCase(handlePostBookmark.rejected, (state, action) => {
                state.error = action.payload;
            });

    }

});

// export reducer function
export const { clearMessages } = postSlice.actions;

// export postSlice reducer
export default postSlice.reducer;