import { createSlice } from "@reduxjs/toolkit";
import { createPost, getSinglePost, handlePostBookmark, handlePostLike, loadFeed } from "./postThunk";
import { getCommentsForPost } from "../comment/commentThunk";

// initial state for post slice
const initialState = {

    postsById: {}, // to store posts in normalized form postId as key and post data as value
    feedIds: [], // to store the order of posts in feed as array of postIds
    singlePostId: null, // to store single post id when we are viewing single post

    /* --------------- */

    posts: [],
    singlePost: null, // state to store single post

    /* --------------- */

    success: false, // for sucess flag
    hasMore: true, // for the feed
    cursor: null, // to get the next batch of posts for feed
    phase: null, // phase is for post uploading feature
    message: null, // message is for succes message
    error: null, // this is for erroe message

    postLoading: false, // for creating post
    feedLoading: false, // for loading feed
    singlePostLoading: false, // loading for single post
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

        // reducer function to clear book mark status
        clearBookmarkStatus: (state, action) => {
            const post = state.posts.find(p => p._id === action.payload);
            if (post) post.bookmarkStatus = null;
        },

        // update post like count
        updatePostLikes: (state, action) => {

            // get postsid and likes likesCount from payload 
            const { postId, likesCount } = action.payload;

            // get post
            const post = state.posts.find(p => p._id === postId);

            // increase likes count
            if (post) {
                post.likesCount = likesCount;
            }

        },

        // update post comment count
        updatePostCommentsCount: (state, action) => {

            // get postId and incrementdBy
            const { postId, incrementBy } = action.payload;

            // find post
            const post = state.posts.find(p => p._id === postId);

            // increase comments count
            if (post) {
                post.commentsCount += incrementBy;
            }
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

                state.feedLoading = false; // stop feed loading
                state.success = true; // success true
                state.phase = "feedLoaded"; // phase feed loaded-

                // extracting posts, nextCursor and hasMore flag from payload
                const { posts, nextCursor, hasMore } = action.payload;

                // store posts in normalized form in postsById and store the order of posts in feedIds
                posts.forEach(post => {

                    // if post id is not in postById then only push to feedIds to avoid duplicate id in feedIds
                    if (!state.postsById[post._id]) {
                        state.feedIds.push(post._id);
                    }

                    // store post in postsById with post id as key 
                    state.postsById[post._id] = post;

                });

                // {will be removed soon} append posts in posts initial state for fead
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

            // GET SINGLE POST
            .addCase(getSinglePost.pending, (state) => {

                // loading true
                state.singlePostLoading = true;

                // error null
                state.error = null;

            })
            .addCase(getSinglePost.fulfilled, (state, action) => {

                // post loading false
                state.singlePostLoading = false;

                // get data from actoin payload
                const { postData } = action.payload

                // set postData in single post
                state.singlePost = postData;
            })
            .addCase(getSinglePost.rejected, (state, action) => {

                // loading false
                state.singlePostLoading = false;

                // setting error
                state.error = action.payload;

            })

            // LIKE POST
            .addCase(handlePostLike.pending, (state, action) => {

                // get posid from action meta argument
                const postId = action.meta.arg;

                // find post
                const post = state.posts.find(p => p._id === postId);

                // optimistic increase isLiked status and likesCount
                if (post) {
                    post.isLiked = !post.isLiked;
                    post.likesCount += post.isLiked ? 1 : -1;
                }

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

                // find posts
                const post = state.posts.find(p => p._id === postId);

                if (post) {
                    post.bookmarkLoading = false;
                    post.isBookmarked = bookmarked;
                    post.bookmarkStatus = bookmarked ? "saved" : "unsaved";
                }

            })
            .addCase(handlePostBookmark.rejected, (state, action) => {
                state.error = action.payload;
            })

            // TO SYNK WITH THE COMMENT COUNT
            .addCase(getCommentsForPost.fulfilled, (state, action) => {

                // get postId and actualCount
                const { postId, actualCount } = action.payload;

                // find post
                const post = state.posts.find(p => p._id === postId);

                // synk with actual coment count
                if (post) {
                    post.commentsCount = actualCount;
                }
            })

    }

});

// export reducer function
export const { clearMessages, clearBookmarkStatus, updatePostLikes, updatePostCommentsCount } = postSlice.actions;

// export postSlice reducer
export default postSlice.reducer;