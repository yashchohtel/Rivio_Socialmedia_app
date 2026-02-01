import React from 'react'
import { useLocation } from "react-router-dom";
const Profile = () => {

    // get state from useLocation
    const location = useLocation();

    // initial user
    const user = location.state?.user;

    console.log(user);
    console.log(user.username);

    return (
        <>
            <h1>welcome to Profile</h1>
        </>

    )
}

export default Profile