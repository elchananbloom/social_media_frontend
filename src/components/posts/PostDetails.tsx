import { useEffect, useRef, useState } from "react";
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";


export default function PostDetail({
  post,
  focusComment,
  onFocused,
  onCommentCreated,
  onToggleLike, 
}: {
  post: PostResponse | null;
  focusComment: boolean;
  onFocused: () => void;
  onCommentCreated?: (postId: number) => Promise<void> | void;
  onToggleLike: (postId: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusComment) {
      inputRef.current?.focus();
      onFocused();
    }
  }, [focusComment, post?.id, onFocused]);

  if (!post) return <div><h3>Detail</h3><p>Select a post.</p></div>;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <h3>Detail</h3>

      <p>{post.content}</p>
      <small style={{ color: "#666" }}>
        Author: {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </small>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
        >
          {post.isLikedByCurrentUser ? "❤️ Unlike" : "🤍 Like"} (
          {post.likesCount})
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
