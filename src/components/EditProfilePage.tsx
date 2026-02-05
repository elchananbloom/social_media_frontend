import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";


const EditProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({
        id: null as number | null,
        username: "",
        displayName: "",
        aboutMe: "",
        location: "",
        birthdate: "",
        gender: "",
        phoneNumber: "",
        profilePictureUrl: "",
        secondaryImageUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("EditProfilePage mounted for user:", user?.username);
        // Fetch profile data for the current user
        const fetchProfile = async () => {
            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }
            try {
                const base_url = "http://localhost:8082";
                const token = localStorage.getItem('token');
                const response = await axios.get(`${base_url}/profiles/${user.username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Fetched profile:", response.data);
                console.log("Profile ID:", response.data.id);
                console.log("Full response:", response);
                setProfile(response.data);
                setFormData({
                    id: response.data.id || null,
                    username: response.data.username || "",
                    displayName: response.data.displayName || "",
                    aboutMe: response.data.aboutMe || "",
                    location: response.data.location || "",
                    birthdate: response.data.birthdate ? response.data.birthdate.split('T')[0] : "",
                    gender: response.data.gender || "",
                    phoneNumber: response.data.phoneNumber || "",
                    profilePictureUrl: response.data.profilePictureUrl || "",
                    secondaryImageUrl: response.data.secondaryImageUrl || "",
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setError("Failed to load profile");
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const base_url = "http://localhost:8082";
            const token = localStorage.getItem('token');
            console.log(token);
            const submitData = {
                id: formData.id,
                username: formData.username,
                displayName: formData.displayName,
                aboutMe: formData.aboutMe,
                location: formData.location,
                birthdate: formData.birthdate,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                profilePictureUrl: formData.profilePictureUrl,
                secondaryImageUrl: formData.secondaryImageUrl,
            };
            const response = await axios.put(`${base_url}/profiles/${profile?.id}`, submitData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log("Profile updated:", response.data);
            setProfile(response.data);
            navigate(`/profile/me`);
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Failed to update profile");
        }
    };

    if (loading) {
        return <p>Loading profile...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="displayName">Display Name:</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={formData.profilePictureUrl}
                        onChange={handleChange}
                    />
                </div>
                {formData.profilePictureUrl && (
                    <img src={formData.profilePictureUrl} alt="Profile preview" style={{ maxWidth: "200px" }} />
                )}
                <div>
                    <label htmlFor="secondaryImageUrl">Secondary Image URL:</label>
                    <input
                        type="text"
                        id="secondaryImageUrl"
                        name="secondaryImageUrl"
                        value={formData.secondaryImageUrl}
                        onChange={handleChange}
                    />
                </div>
                {formData.secondaryImageUrl && (
                    <img src={formData.secondaryImageUrl} alt="Secondary preview" style={{ maxWidth: "200px" }} />
                )}
                <div>
                    <label htmlFor="aboutMe">About Me:</label>
                    <textarea
                        id="aboutMe"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
                <div>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="birthdate">Birthdate:</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate(-1)}>Cancel</button>
            </form>
        </div>
    );
};

export default EditProfilePage;
