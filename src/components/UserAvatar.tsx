import { useState, useEffect } from "react";
import "./UserAvatar.css";

type UserAvatarProps = {
    username: string;
    profilePictureUrl?: string | null;
    size?: "small" | "medium" | "large";
    className?: string;
};

export default function UserAvatar({
    username,
    profilePictureUrl,
    size = "medium",
    className = "",
}: Readonly<UserAvatarProps>) {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [profilePictureUrl]);

    const containerClass = `user-avatar-container user-avatar-${size} ${className}`;

    const getColor = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00ffffff).toString(16).toUpperCase();
        return '#' + "00000".substring(0, 6 - c.length) + c;
    };

    const showImage = profilePictureUrl && !imageError;

    const placeholderStyle = !showImage
        ? { backgroundColor: getColor(username) }
        : {};

    return (
        <div className={containerClass}>
            {showImage ? (
                <img
                    src={profilePictureUrl}
                    alt={username}
                    className="user-avatar-image"
                    onError={() => setImageError(true)}
                />
            ) : (
                <div className="user-avatar-placeholder" style={placeholderStyle}>
                    {username.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    );
}

