import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// getting backend url from env
const backendUrl = import.meta.env.VITE_BACKEND_URL;


// thunk to register user
export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {

    try {

        // send post request to register user
        const { data } = await axios.post(`${backendUrl}/api/user/register`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        // return succes response
        return data;

    } catch (err) {

        console.log(err);

        // handle error
        return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }

});


