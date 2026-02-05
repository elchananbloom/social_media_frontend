// src/components/LogOut.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LogOut() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // call provider logout if present
            await logout?.();
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            // ensure we land on the login page
            navigate("/login");
        }
    };

    // don't show logout when no user
    if (!user) return null;

    return (
        <button type="button" onClick={handleLogout} style={{ padding: 8 }}>
            Log out
        </button>
    );
}
