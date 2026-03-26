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

// thunk to delete notification
export const deleteNotification = createAsyncThunk("notification/deleteNotification", async ({ notificationId, deletedNotification }, { rejectWithValue }) => {

    try {

        // delete request to delete notificaion
        await api.delete(`/api/notifications/deleteNotification/${notificationId}`);

        // return notificatoinId
        return { notificationId };

    } catch (error) {

        // error handlng
        toast.error(error.response?.data?.message || "Failed to delete notification");
        return rejectWithValue({ deletedNotification });

    }

});

// thunk to delete all notificaon
export const deleteAllNotifications = createAsyncThunk( "notification/deleteAllNotifications", async ({ deletedNotifications }, { rejectWithValue }) => {

        try {

            // api call
            await api.delete("/api/notifications/deleteAllNotifications");

            return {}; // kuch return karne ki need nahi

        } catch (error) {

            toast.error(error.response?.data?.message || "Failed to delete all notifications");

            return rejectWithValue({ deletedNotifications });

        }

    }
);