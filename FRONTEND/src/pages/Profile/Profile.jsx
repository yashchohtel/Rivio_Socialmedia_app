/* eslint-disable no-unused-vars */
import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {

    // get state from useLocation
    const location = useLocation();

    // get user id from url useParams
    const { id } = useParams();

    /* -------------------------------------- */

    // initial user
    const stateUser = location.state?.user;

    // get user from redux store
    const reduxUser = useSelector(state => state.auth.user);

    // final user (priority: state → redux)
    const user = stateUser || reduxUser;

    /* -------------------------------------- */

    return (
        <>
            <h1>welcome to Profile</h1>
        </>

    )
}

export default Profile