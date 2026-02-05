import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import "./ProfilePage.css";

const ProfilePage = () => {
  let { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayedUsername, setDisplayedUsername] = useState<string | undefined>(username);

  useEffect(() => {
    console.log("ProfilePage mounted with username param:", username);
    // Fetch profile data based on the id from params
    const fetchProfile = async () => {
      console.log("Fetching profile for username:", user);
      let usernameToFetch = username;

      // Handle /profile/me route (username is undefined) or explicit 'me' parameter
      if ((!username || username === 'me') && user) {
        console.log("Fetching profile for current user:", user.username);
        usernameToFetch = user.username;
        setDisplayedUsername(user.username);
      }

      if (!usernameToFetch) {
        console.error("No username available to fetch profile");
        setProfile(null);
        return;
      }
      try {
        const base_url = "http://localhost:8082";
        const response = await axios.get(`${base_url}/profiles/${usernameToFetch}`,
          {
            headers: {
              "Content-Type": "application/json",
              'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Fetched profile:", response.data);
        setProfile(response.data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        if (error.response?.status === 404) {
          console.log("Profile not found for user:", usernameToFetch);
          setProfile(null);
        } else {
          setProfile(null);
        }
      }
    };

    // Always fetch profile - handle undefined username inside fetchProfile
    fetchProfile();
  }, [username, user]);

  return (
    <div className="profile-container">
      {profile ? (
        <div className="profile-header">
          <div className="profile-cover">
            {profile.secondaryImageUrl && (
              <img src={profile.secondaryImageUrl} alt={`${profile.username}'s profile`} className="profile-cover-image" />
            )}
          </div>

          <div className="profile-action-bar">
            {user?.username === displayedUsername && (
              <button onClick={() => navigate("/profile/me/edit")} className="edit-profile-button">Edit profile</button>
            )}
          </div>

          <div className="profile-avatar-wrapper">
            <UserAvatar
              username={profile.username}
              profilePictureUrl={profile.profilePictureUrl}
              size="large"
              className="profile-avatar-large-position"
            />
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profile.displayName || profile.username}</h1>
            <p className="profile-handle">@{profile.username}</p>

            <div className="profile-bio">
              {profile.aboutMe || "No bio yet."}
            </div>

            <div className="profile-details">
              {profile.location && (
                <span className="profile-detail-item">📍 {profile.location}</span>
              )}
              {profile.birthdate && (
                <span className="profile-detail-item">🎈 {profile.birthdate}</span>
              )}
              {profile.gender && (
                <span className="profile-detail-item">⚧ {profile.gender}</span>
              )}
              {profile.phoneNumber && (
                <span className="profile-detail-item">📞 {profile.phoneNumber}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="not-found-container">
          <p className="not-found-title">Profile not found.</p>
          {user?.username === displayedUsername && (
            <div>
              <p className="not-found-text">It looks like you haven't created your profile yet.</p>
              <button onClick={() => navigate("/create-profile")} className="create-profile-button">Create Profile</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default ProfilePage;