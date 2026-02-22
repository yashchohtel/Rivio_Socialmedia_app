/* eslint-disable no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
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
export const getCommentsForPost = createAsyncThunk("comments/getCommentsForPost", async (postId, { rejectWithValue }) => {

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
export const addComment = createAsyncThunk("comment/addComment", async ({ postId, text }, thunkAPI) => {

    try {

        // http://localhost:5000/api/posts/commentOnPost/:targetPostId

        // send post request to add comment for post
        const response = await api.post(`/api/posts/commentOnPost/${postId}`, { text });

        // return postId and comment data to update the store 
        return { postId, comment: response.data.comment };

    } catch (error) {

        toast.error(error.response?.data?.message || "Failed to add comment");

        return thunkAPI.rejectWithValue(error.response?.data);

    }

});