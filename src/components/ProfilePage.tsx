import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";


const ProfilePage = () => {
    let {username} = useParams();
    const {user} = useAuth();


    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        console.log("ProfilePage mounted with username param:", username);
        // Fetch profile data based on the id from params
        const fetchProfile = async () => {
            if(username === 'me' && user){
                username = user.username;
            }
            try {
                const base_url = "http://localhost:8082";
                const response = await axios.get(`${base_url}/profiles/${username}`);
                console.log("Fetched profile:", response.data);
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, []);
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
          <p>Phone Number: {profile.phoneNumber || "N/A"}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  )
};

export default ProfilePage;