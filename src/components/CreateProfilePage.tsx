import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axios from "axios";
import "./CreateProfilePage.css";

const CreateProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: user?.username || "",
        displayName: "",
        aboutMe: "",
        location: "",
        birthdate: "",
        gender: "",
        phoneNumber: "",
        profilePictureUrl: "",
        secondaryImageUrl: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const base_url = "http://localhost:8084";
            const token = localStorage.getItem('token');

            const submitData = {
                username: formData.username,
                displayName: formData.displayName || formData.username,
                aboutMe: formData.aboutMe,
                location: formData.location,
                birthdate: formData.birthdate,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                profilePictureUrl: formData.profilePictureUrl,
                secondaryImageUrl: formData.secondaryImageUrl,
            };

            const response = await axios.post(`${base_url}/profiles`, submitData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("Profile created:", response.data);
            navigate(`/profile/me`);
        } catch (error: any) {
            console.error("Error creating profile:", error);
            setError(error.response?.data?.message || "Failed to create profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-profile-container">
            <h1 className="create-profile-title">Create Your Profile</h1>
            <p className="create-profile-subtitle">Welcome! Let's set up your profile.</p>

            {error && <p className="profile-error">{error}</p>}

            <form onSubmit={handleSubmit} className="create-profile-form">
                <div className="profile-form-group">
                    <label htmlFor="displayName" className="profile-label">Display Name: *</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                        className="profile-input"
                    />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="profilePictureUrl" className="profile-label">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={formData.profilePictureUrl}
                        onChange={handleChange}
                        className="profile-input"
                    />
                    {formData.profilePictureUrl && (
                        <img src={formData.profilePictureUrl} alt="Profile preview" className="profile-preview-image" />
                    )}
                </div>

                <div className="profile-form-group">
                    <label htmlFor="aboutMe" className="profile-label">About Me:</label>
                    <textarea
                        id="aboutMe"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleChange}
                        rows={4}
                        className="profile-textarea"
                    />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="location" className="profile-label">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="profile-input"
                    />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="birthdate" className="profile-label">Birthdate:</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        className="profile-input"
                    />
                </div>

                <div className="profile-form-group">
                    <label htmlFor="gender" className="profile-label">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="profile-select"
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>

                <div className="profile-form-group">
                    <label htmlFor="phoneNumber" className="profile-label">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="profile-input"
                    />
                </div>

                <button type="submit" disabled={isSubmitting} className="create-profile-submit">
                    {isSubmitting ? "Creating..." : "Create Profile"}
                </button>
            </form>
        </div>
    );
};

export default CreateProfilePage;
