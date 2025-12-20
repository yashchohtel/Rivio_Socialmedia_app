import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// getting backend url from env
const backendUrl = import.meta.env.VITE_BACKEND_URL;


// thunk to load user data and auth state
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {

    try {

        // send get request to load user data
        const { data } = await axios.get(`${backendUrl}/api/users/isUserAuthenticated`, {
            withCredentials: true,
        });

        // if user is authenticated, fetch user data
        if (data.success) {

            // http://localhost:5000/api/users/getMyProfile
            const { data: userData } = await axios.get(`${backendUrl}/api/users/getMyProfile`, {
                withCredentials: true,
            });

            return userData;

        } else {
            return rejectWithValue("User not authenticated");
        }

    } catch (err) {

        console.log(err);

        // handle error
        return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }

});

// thunk to register user
export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {

    try {

        // send post request to register user
        const { data } = await axios.post(`${backendUrl}/api/users/registerUser`, formData, {
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

// thunk to login user
export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {

    try {

        // send post request to login user
        const { data } = await axios.post(`${backendUrl}/api/users/loginUser`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
        });

        // return success response
        return data;

    } catch (err) {

        console.log(err);

        // handle error
        return rejectWithValue(err.response?.data?.message || "Something went wrong");

    }

});