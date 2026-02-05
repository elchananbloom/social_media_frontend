import { useEffect, useRef } from "react";
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";
import UserAvatar from "../UserAvatar";
import "./PostDetails.css";

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

  useEffect(() => {
    if (focusComment) {
      inputRef.current?.focus();
      onFocused();
    }
  }, [focusComment, post?.id, onFocused]);

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
