/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// getting backend url from env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// instance of axios to follow DRY
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// thunk to get comments for post
export const getCommentsForPost = createAsyncThunk("comment/getCommentsForPost", async (postId, { rejectWithValue }) => {

    try {

        // send request to get comments for post
        const { data } = await api.get(`/api/posts/getCommentsForPost/${postId}`);

        // return comments data
        return data;

    } catch (error) {

        toast.error(error.response?.data?.message || "Failed to fetch comments");

        return rejectWithValue(error.response?.data);

    }

});

// thunk to add comment for post
export const addComment = createAsyncThunk("comment/addComment", async ({ postId, text }, { rejectWithValue }) => {

    try {

        // send post request to add comment for post
        const response = await api.post(`/api/posts/commentOnPost/${postId}`, { text });

        // return postId and comment data to update the store 
        return { postId, comment: response.data.comment };

    } catch (error) {

        toast.error(error.response?.data?.message || "Failed to add comment");

        return rejectWithValue(error.response?.data);

    }

});

// thunk to add replay on comment
export const replyOnComment = createAsyncThunk("comment/replyOnComment", async ({ commentId, repliedTo, text }, { rejectWithValue }) => {

    try {

        // send post request to comment on the post
        const response = await api.post(`/api/posts/replyOnComment/${commentId}`, { repliedTo, text });

        // return data of response
        return response.data;

    } catch (error) {

        // error handle
        toast.error(error.response?.data?.message || "Failed to add reply");

        return rejectWithValue(error.response?.data);

    }

});

// thunk to delete comment of post
export const deleteComment = createAsyncThunk("comment/DeleteComment", async ({ commentId, postId, deletedComment }, { rejectWithValue }) => {

    try {

        // send delete request
        const response = await api.delete(`/api/posts/DeleteComment/${commentId}`);

        // return data of response
        return response.data;

    } catch (error) {

        // error handle
        toast.error(error.response?.data?.message || "Failed to delete comment");

        return rejectWithValue({ error: error.response?.data, commentId, postId, deletedComment });

    }

});

// thunk to delete replie of the comment
export const deleteReply = createAsyncThunk("comment/deleteReply", async ({ commentId, replyId, postId, deletedReply }, { rejectWithValue }) => {

    try {

        // send delete request
        const response = await api.delete(`/api/posts/DeleteComment/${commentId}/${replyId}`);

        // return data of response
        return response.data;

    } catch (error) {

        // error handle
        toast.error(error.response?.data?.message || "Failed to delete reply");

        return rejectWithValue({ commentId, postId, deletedReply });

    }

});

// thunk to like unlike comment
export const likeUnlikeComment = createAsyncThunk("comment/likeUnlikeComment", async ({ commentId }, { rejectWithValue }) => {

    try {

        // send likeUnlike comment request
        const response = await api.patch(`/api/posts/likeComments/${commentId}`);

        // return data of response
        return response.data;


    } catch (error) {

        // error handle
        toast.error(error.response?.data?.message || "Failed to like/unlike comment");
        return rejectWithValue(error.response?.data?.message || "Failed to like/unlike comment");

    }

})

// thunk to like unline comment
export const likeUnlikeReply = createAsyncThunk("comment/likeUnlikeReply", async ({ commentId, replyId }, { rejectWithValue }) => {

    try {

        // send like unlike comment request
        const response = await api.patch(`/api/posts/likeComments/${commentId}/${replyId}`);

        // return response data
        return response.data;

    } catch (error) {

        // error handling
        toast.error(error.response?.data?.message || "Failed to like/unlike reply");
        return rejectWithValue(error.response?.data?.message || "Failed to like/unlike reply");

    }

})