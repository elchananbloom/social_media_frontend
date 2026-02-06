import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAvatar.css";

type UserAvatarProps = {
    username: string;
    profilePictureUrl?: string | null;
    size?: "small" | "medium" | "large";
    className?: string;
    disableNavigation?: boolean;
};

export default function UserAvatar({
    username,
    profilePictureUrl,
    size = "medium",
    className = "",
    disableNavigation = false,
}: Readonly<UserAvatarProps>) {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setImageError(false);
    }, [profilePictureUrl]);

    const handleClick = (e: React.MouseEvent) => {
        if (!disableNavigation) {
            e.stopPropagation();
            navigate(`/profile/${username}`);
        }
    };

    const containerClass = `user-avatar-container user-avatar-${size} ${!disableNavigation ? 'clickable' : ''} ${className}`;

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
        <div
            className={containerClass}
            onClick={handleClick}
            style={{ cursor: disableNavigation ? 'default' : 'pointer' }}
        >
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

