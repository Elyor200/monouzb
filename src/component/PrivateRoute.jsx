import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const telegramUserId = localStorage.getItem("telegramUserId");

    if (!telegramUserId) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;