import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState("");

    if (!user) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/profile/${searchQuery.trim()}`);
            setSearchQuery("");
        }
    };

    const handleLogout = async () => {
        try {
            if (logout) {
                await logout();
            }
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            navigate("/login");
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                        end
                    >
                        <span className="nav-icon">🏠</span>
                        <span className="nav-text">Home</span>
                    </NavLink>

                    <NavLink
                        to="/profile/me"
                        className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                    >
                        <span className="nav-icon">👤</span>
                        <span className="nav-text">Profile</span>
                    </NavLink>
                </div>

                <form onSubmit={handleSearch} className="nav-search-form">
                    <input
                        type="text"
                        className="nav-search-input"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="nav-actions">
                    <button onClick={handleLogout} className="nav-logout-button">
                        Log out
                    </button>
                </div>
            </div>
        </nav>
    );
}
