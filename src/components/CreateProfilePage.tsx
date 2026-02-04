import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import axios from "axios";

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
            const base_url = "http://localhost:8082";
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
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h1>Create Your Profile</h1>
            <p>Welcome! Let's set up your profile.</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="displayName">Display Name: *</label>
                    <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="profilePictureUrl">Profile Picture URL:</label>
                    <input
                        type="text"
                        id="profilePictureUrl"
                        name="profilePictureUrl"
                        value={formData.profilePictureUrl}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                    {formData.profilePictureUrl && (
                        <img src={formData.profilePictureUrl} alt="Profile preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
                    )}
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="aboutMe">About Me:</label>
                    <textarea
                        id="aboutMe"
                        name="aboutMe"
                        value={formData.aboutMe}
                        onChange={handleChange}
                        rows={4}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="birthdate">Birthdate:</label>
                    <input
                        type="date"
                        id="birthdate"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" disabled={isSubmitting} style={{ padding: "10px 20px", marginRight: "10px" }}>
                    {isSubmitting ? "Creating..." : "Create Profile"}
                </button>
            </form>
        </div>
    );
};

export default CreateProfilePage;
