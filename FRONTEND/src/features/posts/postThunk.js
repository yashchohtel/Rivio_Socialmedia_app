import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// getting backend url from env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

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