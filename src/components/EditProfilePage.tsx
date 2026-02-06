import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";
import { PROFILE_SERVICE_BASE_URL } from "../utils/url";
import "./EditProfilePage.css";


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
                const token = localStorage.getItem('token');
                const response = await axios.get(`${PROFILE_SERVICE_BASE_URL}/profiles/${user.username}`, {
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
            const response = await axios.put(`${PROFILE_SERVICE_BASE_URL}/profiles/${profile?.id}`, submitData,
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
        return <p className="loading-text">Loading profile...</p>;
    }

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    return (
        <div className="edit-profile-container">
            <h1 className="edit-profile-title">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="edit-form-group">
                    <label htmlFor="displayName" className="edit-label">Display Name:</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                <div className="edit-form-group">
                    <label htmlFor="profilePictureUrl" className="edit-label">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={formData.profilePictureUrl}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                {formData.profilePictureUrl && (
                    <img src={formData.profilePictureUrl} alt="Profile preview" className="edit-preview-image" />
                )}
                <div className="edit-form-group">
                    <label htmlFor="secondaryImageUrl" className="edit-label">Secondary Image URL:</label>
                    <input
                        type="text"
                        id="secondaryImageUrl"
                        name="secondaryImageUrl"
                        value={formData.secondaryImageUrl}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                {formData.secondaryImageUrl && (
                    <img src={formData.secondaryImageUrl} alt="Secondary preview" className="edit-preview-image" />
                )}
                <div className="edit-form-group">
                    <label htmlFor="aboutMe" className="edit-label">About Me:</label>
                    <textarea
                        id="aboutMe"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleChange}
                        rows={4}
                        className="edit-textarea"
                    />
                </div>
                <div className="edit-form-group">
                    <label htmlFor="location" className="edit-label">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                <div className="edit-form-group">
                    <label htmlFor="birthdate" className="edit-label">Birthdate:</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                <div className="edit-form-group">
                    <label htmlFor="gender" className="edit-label">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="edit-select"
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>
                <div className="edit-form-group">
                    <label htmlFor="phoneNumber" className="edit-label">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="edit-input"
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="save-button">Save Changes</button>
                    <button type="button" onClick={() => navigate(-1)} className="cancel-button">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;
