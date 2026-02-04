import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";


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
        const response = await axios.get(`${base_url}/profiles/${usernameToFetch}`);
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
    <div>
      {profile ? (
        <div>
          <h1>{profile.displayName || profile.username}'s Profile</h1>
          {profile.profilePictureUrl && (
            <img src={profile.profilePictureUrl} alt={`${profile.username}'s profile`} />
          )}
          <p>About Me: {profile.aboutMe || "N/A"}</p>
          <p>Location: {profile.location || "N/A"}</p>
          <p>Birthdate: {profile.birthdate || "N/A"}</p>
          <p>Gender: {profile.gender || "N/A"}</p>
          {user?.username === displayedUsername && (
            <button onClick={() => navigate("/profile/me/edit")}>Edit Profile</button>
          )}
          <p>Phone Number: {profile.phoneNumber || "N/A"}</p>
        </div>
      ) : (
        <div>
          <p>Profile not found.</p>
          {user?.username === displayedUsername && (
            <div>
              <p>It looks like you haven't created your profile yet.</p>
              <button onClick={() => navigate("/create-profile")}>Create Profile</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default ProfilePage;