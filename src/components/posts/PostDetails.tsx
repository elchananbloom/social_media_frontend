import { useEffect, useRef, useState } from "react";
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";
import { likePost, unlikePost, Like, getLikesForPost } from "../../api/likesApi";
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
  const [likes, setLikes] = useState<Like[]>([]);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [loading, setLoading] = useState(false);


  const toggleLike = async () => {
    if (!post || !user) return;

    try {
      setLoading(true);
      if (likedByCurrentUser) {
        await unlikePost(post.id, user.username);
        setLikes(prev => prev.filter(l => l.username !== user.username));
      } else {
        const newLike = await likePost(post.id, user.username);
        setLikes(prev => [...prev, newLike]);
      }
      setLikedByCurrentUser(!likedByCurrentUser);
    } catch (err) {
      console.error("Failed to toggle like", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (focusComment) {
      inputRef.current?.focus();
      onFocused();
    }
  }, [focusComment, post?.id, onFocused]);

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
  

  if (!post) return <div><h3>Detail</h3><p>Select a post.</p></div>;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <h3>Detail</h3>

      <p>{post.content}</p>
      <small style={{ color: "#666" }}>
        Author: {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </small>

      <div style={{ marginTop: 8 }}>
        <button onClick={toggleLike} disabled={loading}>
          {likedByCurrentUser ? "❤️ Unlike" : "🤍 Like"} ({likes.length})
        </button>
      </div>

      <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
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
