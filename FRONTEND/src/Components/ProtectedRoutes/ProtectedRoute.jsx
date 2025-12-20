import React from 'react'

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {

    // getting required data from global store using useSelector
    const { isAuthenticated } = useSelector((state) => state.auth);

    // check if user is Authenticated or not
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // if user is authenticated then return the children component
    return children;

};

export default ProtectedRoute;