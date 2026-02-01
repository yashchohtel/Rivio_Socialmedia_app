import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// thunk to create post
export const createPost = createAsyncThunk('posts/createPost', async ({ files, postData }, { rejectWithValue }) => {

    try {

        // form data to send file and text data
        const formData = new FormData();

        // text fields
        formData.append("caption", postData.caption);
        formData.append("location", postData.location);

        // images (KEY MUST MATCH multer)
        files.forEach((file) => {
            formData.append("postImage", file);
        });

        // send post request to register user
        const { data } = await axios.post(`${backendUrl}/api/posts/createPost`, formData, {
            withCredentials: true,
        });

        // return succes response
        return data;

    } catch (err) {

        console.log(err);

        // handle error
        return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }

});

// thunk to load feed
export const loadFeed = createAsyncThunk("posts/loadFeed", async (cursor, { rejectWithValue }) => {

    try {

        // if cursor add cursor query to url
        const url = cursor ? `/api/posts/getAllPosts?cursor=${cursor}` : `/api/posts/getAllPosts`;

        // calling api through axios instance
        const { data } = await api.get(url);

        // backend se jo aata hai wahi return
        return data; // { posts, nextCursor, success }

    } catch (err) {

        return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }

});

// thunk to handle a like
export const handlePostLike = createAsyncThunk("posts/handlePostLike", async (id, { rejectWithValue }) => {

    try {

        // calling api thorugh axios instance
        const { data } = await api.patch(`/api/posts/likePost/${id}`);
        
        // returnt the data 
        return data;

    } catch (err) {

        return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }

})