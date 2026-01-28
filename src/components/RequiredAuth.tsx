import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react";


const RequiredAuth = ({children}: {children?: React.ReactNode}) => {
    const {user} = useAuth();
    if(!user){
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}

export default RequiredAuth;