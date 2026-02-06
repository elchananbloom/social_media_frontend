import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getFollowers, getFollowing } from "../api/followApi";
import { useAuth } from "../hooks/useAuth";
import UserAvatar from "./UserAvatar";
import axios from "axios";
import { Profile } from "../utils/types";
import { PROFILE_SERVICE_BASE_URL } from "../utils/url";
import "./FollowList.css";

const FollowList = () => {
    const { username, type } = useParams<{ username: string; type: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);

    const targetUsername = (!username || username === "me") ? user?.username : username;

    useEffect(() => {
        const fetchList = async () => {
            if (!targetUsername) return;
            setLoading(true);
            try {
                let usernames: string[] = [];
                if (type === "followers") {
                    usernames = await getFollowers(targetUsername);
                } else {
                    usernames = await getFollowing(targetUsername);
                }

                const profiles = await Promise.all(
                    usernames.map(async (uname) => {
                        try {
                            const response = await axios.get(`${PROFILE_SERVICE_BASE_URL}/profiles/${uname}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            });
                            return response.data;
                        } catch (err) {
                            console.error(`Failed to fetch profile for ${uname}`, err);
                            return { username: uname } as Profile;
                        }
                    })
                );

                setUsers(profiles);
            } catch (error) {
                console.error("Error fetching follow list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [targetUsername, type]);

    const title = type === "followers" ? "Followers" : "Following";

    return (
        <div className="follow-list-container">
            <div className="follow-list-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    ←
                </button>
                <div className="header-text">
                    <h2>{title}</h2>
                    <span className="subtitle">@{targetUsername}</span>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading users...</div>
            ) : (
                <div className="user-list">
                    {users.length > 0 ? (
                        users.map((profile) => (
                            <Link
                                key={profile.username}
                                to={`/profile/${profile.username}`}
                                className="user-item"
                            >
                                <UserAvatar
                                    username={profile.username}
                                    profilePictureUrl={profile.profilePictureUrl}
                                    size="medium"
                                />
                                <div className="user-info">
                                    <span className="display-name">{profile.displayName || profile.username}</span>
                                    <span className="username">@{profile.username}</span>
                                    {profile.aboutMe && <p className="bio">{profile.aboutMe}</p>}
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="empty-state">No {type} yet.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FollowList;
