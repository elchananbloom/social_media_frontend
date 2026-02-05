import { useEffect, useRef, useState } from "react"; 
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";
import UserAvatar from "../UserAvatar";
import "./PostDetails.css";
import { getLikesForPost, likePost, unlikePost, Like } from "../../api/likesApi";
import { useAuth } from "../../hooks/useAuth";

export default function PostDetail({
  post,
  focusComment,
  onFocused,
  onCommentCreated,
}: {
  post: PostResponse | null;
  focusComment: boolean;
  onFocused: () => void;
  onCommentCreated?: (postId: number) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Likes state
  const [likes, setLikes] = useState<Like[]>([]);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch likes whenever the post or user changes
  useEffect(() => {
    if (!post) return;

    const fetchLikes = async () => {
      try {
        const likesData = await getLikesForPost(post.id);
        setLikes(likesData);
        setLikedByCurrentUser(
          user ? likesData.some((l) => l.username === user.username) : false
        );
      } catch (err) {
        console.error("Failed to fetch likes", err);
      }
    };

    fetchLikes();
  }, [post, user]);

  // Focus comment input if focusComment is true
  useEffect(() => {
    if (focusComment) {
      inputRef.current?.focus();
      onFocused();
    }
  }, [focusComment, post?.id, onFocused]);

  // Toggle like/unlike
  const toggleLike = async () => {
    if (!post || !user) return;

    try {
      setLoading(true);
      if (likedByCurrentUser) {
        await unlikePost(post.id, user.username);
        setLikes((prev) => prev.filter((l) => l.username !== user.username));
      } else {
        const newLike = await likePost(post.id, user.username);
        setLikes((prev) => [...prev, newLike]);
      }
      setLikedByCurrentUser(!likedByCurrentUser);
    } catch (err) {
      console.error("Failed to toggle like", err);
    } finally {
      setLoading(false);
    }
  };

    if (!post) return <div className="empty-detail"><h3>Detail</h3><p>Select a post.</p></div>;


  return (
    <div className="post-details-container">
      <h3 className="post-details-header">Detail</h3>

      <div className="post-details-user">
        <UserAvatar username={post.authorUsername} profilePictureUrl={post.authorProfilePictureUrl} />
        <div>
          <div style={{ fontWeight: "bold" }}>@{post.authorUsername}</div>
          <small style={{ color: "var(--secondary-text)" }}>{new Date(post.createdAt).toLocaleString()}</small>
        </div>
      </div>

      <p className="post-details-content">{post.content}</p>

      <div className="post-details-stats">
        <div style={{ marginTop: 8 }}>
        <button onClick={toggleLike} disabled={loading}>
          {likedByCurrentUser ? "❤️ Unlike" : "🤍 Like"} ({likes.length})
        </button>
      </div>
        Comments: <b>{post.commentCount ?? 0}</b>
      </div>

      <CommentsPanel
        postId={post.id}
        inputRef={inputRef}
        onCommentCreated={onCommentCreated}
      />
    </div>
  );
}
