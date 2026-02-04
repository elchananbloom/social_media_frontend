// src/components/RequiredAuth.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RequiredAuth = () => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // preserve original location so login can redirect back if desired
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default RequiredAuth;
