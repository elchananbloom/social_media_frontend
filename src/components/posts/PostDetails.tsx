import { useEffect, useRef } from "react";
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";
import "../../styles/post.css";

export default function PostDetail({
  post,
  focusComment,
  onFocused,
  onCommentCreated,
}: {
  post: PostResponse | null;
  focusComment: boolean;
  onFocused: () => void;
  onCommentCreated: (postId: number) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusComment) {
      inputRef.current?.focus();
      onFocused();
    }
  }, [focusComment, post?.id, onFocused]);

  if (!post) {
    return (
      <div className="post-detail">
        <h3>Detail</h3>
        <p>Select a post.</p>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <h3>Detail</h3>

      <p className="post-content">{post.content}</p>

      {post.imageUrl && post.imageUrl.trim() !== "" && (
        <img
          src={post.imageUrl}
          alt="post"
          className="post-detail-image"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      <div className="detail-meta">
        Author: {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </div>

      <div className="detail-count">
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
