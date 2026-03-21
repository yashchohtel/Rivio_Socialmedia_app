import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// instance of axios to follow DRY
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// thunk to get unread notification count
export const getUnreadNotificationCount = createAsyncThunk("notification/getUnreadCount", async (_, { rejectWithValue }) => {

    try {

        // send request to get all unread notificaion count
        const { data } = await api.get(`/api/notifications/getUnreadCount`);

        // return data
        return data;

    } catch (error) {

        // error handling
        toast.error(error.response?.data?.message || "Failed to fetch unread count");
        return rejectWithValue(error.response?.data);

    }

});

// thunk to get notifications for users
export const getAllNotifications = createAsyncThunk("notification/getAllNotifications", async (_, { rejectWithValue }) => {

    try {

        // send request to get all notification related to user
        const { data } = await api.get(`/api/notifications/getAllNotifications`);

        // return comments data
        return data;

    } catch (error) {

        // error handling
        toast.error(error.response?.data?.message || "Failed to fetch notification");
        return rejectWithValue(error.response?.data);

    }

});