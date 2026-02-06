import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "../utils/types";
import axios from "axios";
import UserAvatar from "./UserAvatar";
import "./ProfilePage.css";
import { getFollowers, getFollowing, followUser, unfollowUser, } from "../api/followApi";
import { getLikesCountByUser, getLikesForPost, likePost, unlikePost } from "../api/likesApi";
import { listPosts, deletePost } from "../utils/PostApi";
import PostList from "./posts/PostList";
import { PostResponse } from "../utils/types";
import { PROFILE_SERVICE_BASE_URL } from "../utils/url";


const ProfilePage = () => {
  let { username } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const displayedUsername = (!username || username === 'me') ? user?.username : username;
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [likesMap, setLikesMap] = useState<{
    [postId: number]: { count: number; likedByCurrentUser: boolean };
  }>({});

  const fetchUserPosts = async () => {
    const targetUsername = profile?.username || displayedUsername;
    console.log("[ProfilePage] fetchUserPosts target:", targetUsername);
    if (!targetUsername) return;
    try {
      setLoadingPosts(true);
      const data = await listPosts({ authorUsernames: [targetUsername], limit: 50 });
      setPosts(data);

      const likesData = await Promise.all(
        data.map(async (p) => {
          const likes = await getLikesForPost(p.id);
          return {
            postId: p.id,
            count: likes.length,
            likedByCurrentUser: user?.username
              ? likes.some((l) => l.username === user.username)
              : false,
          };
        })
      );

      const newLikesMap: typeof likesMap = {};
      likesData.forEach((l) => {
        newLikesMap[l.postId] = { count: l.count, likedByCurrentUser: l.likedByCurrentUser };
      });
      setLikesMap(newLikesMap);
    } catch (err) {
      console.error("ProfilePage Failed to fetch user posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (postId: number) => {
    if (!user) return;
    const current = likesMap[postId];
    if (!current) return;
    try {
      if (current.likedByCurrentUser) {
        await unlikePost(postId, user.username);
      } else {
        await likePost(postId, user.username);
      }
      setLikesMap((prev) => ({
        ...prev,
        [postId]: {
          count: current.likedByCurrentUser ? current.count - 1 : current.count + 1,
          likedByCurrentUser: !current.likedByCurrentUser,
        },
      }));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  useEffect(() => {
    if (displayedUsername || profile?.username) {
      fetchUserPosts();
    }
  }, [displayedUsername, profile?.username, user?.username]);

  const handleFollowToggle = async () => {
    if (!user || !displayedUsername || user.username === displayedUsername) return;

    try {
      if (isFollowing) {
        await unfollowUser(displayedUsername);
        setFollowers((prev) => prev.filter((f) => f !== user.username));
      } else {
        await followUser(displayedUsername);
        setFollowers((prev) => [...prev, user.username]);
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  useEffect(() => {
    if (!displayedUsername) return;

    const fetchTotalLikes = async () => {
      try {
        const count = await getLikesCountByUser(displayedUsername);
        setTotalLikes(count);
      } catch (err) {
        console.error("Failed to fetch total likes:", err);
        setTotalLikes(0);
      }
    };

    fetchTotalLikes();
  }, [displayedUsername]);

  useEffect(() => {
    console.log("ProfilePage mounted with username param:", username);
    // Fetch profile data based on the id from params
    const fetchProfile = async () => {
      console.log("Fetching profile for username:", user?.username);
      let usernameToFetch = username;

      // Handle /profile/me route (username is undefined) or explicit 'me' parameter
      if ((!username || username === 'me') && user) {
        console.log("Fetching profile for current user:", user.username);
        usernameToFetch = user.username;
      }

      if (!usernameToFetch) {
        console.error("No username available to fetch profile");
        setProfile(null);
        return;
      }
      try {
        const response = await axios.get(`${PROFILE_SERVICE_BASE_URL}/profiles/${usernameToFetch}`,
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

        // Fetch followers/following for this profile
        const followersData = await getFollowers(usernameToFetch);
        const followingData = await getFollowing(usernameToFetch);
        setFollowers(followersData);
        setFollowing(followingData);

        // Check if current user is following this profile
        if (user && usernameToFetch !== user.username) {
          setIsFollowing(followersData.includes(user.username));
        }
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
                <span className="profile-detail-item">🎈 {new Date(profile.birthdate).toLocaleDateString()}</span>
              )}
              {profile.gender && (
                <span className="profile-detail-item">⚧ {profile.gender}</span>
              )}
              {profile.phoneNumber && (
                <span className="profile-detail-item">📞 {profile.phoneNumber}</span>
              )}
            </div>
            {user?.username !== displayedUsername && (
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={handleFollowToggle}
                  className={isFollowing ? "unfollow-button" : "follow-button"}
                  style={{
                    backgroundColor: isFollowing ? "white" : "black",
                    color: isFollowing ? "black" : "white",
                    border: isFollowing ? "1px solid var(--border-color)" : "none",
                    borderRadius: "9999px",
                    padding: "8px 16px",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            )}
            <div className="profile-stats">
              <div
                className="profile-stat-item clickable"
                onClick={() => navigate(`/profile/${username || 'me'}/following`)}
                style={{ cursor: "pointer" }}
              >
                <span className="stat-value">{following.length}</span>
                <span className="stat-label">Following</span>
              </div>
              <div
                className="profile-stat-item clickable"
                onClick={() => navigate(`/profile/${username || 'me'}/followers`)}
                style={{ cursor: "pointer" }}
              >
                <span className="stat-value">{followers.length}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="profile-stat-item">
                <span className="stat-value">{totalLikes}</span>
                <span className="stat-label">Likes</span>
              </div>
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

      {displayedUsername && (
        <div className="profile-posts-section">
          <h2 className="profile-section-title">Posts</h2>
          {loadingPosts ? (
            <p className="profile-posts-loading">Loading posts...</p>
          ) : (
            <div style={{ padding: "0 16px" }}>
              <PostList
                posts={posts}
                selectedPostId={null}
                onSelect={() => { }}
                onDelete={handleDelete}
                currentUsername={user?.username ?? null}
                likesMap={likesMap}
                onToggleLike={toggleLike}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default ProfilePage;
