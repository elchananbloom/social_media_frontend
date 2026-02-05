import { PostResponse } from "../../utils/types";
import UserAvatar from "../UserAvatar";
import "./PostCard.css";

type PostCardProps = {
  post: PostResponse;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onComment?: () => void;
  likes: number;
  likedByCurrentUser: boolean;
  onToggleLike: () => void;
};

export default function PostCard({
  post,
  selected,
  onSelect,
  onDelete,
  onComment,
  likes,
  likedByCurrentUser,
  onToggleLike,
}: Readonly<PostCardProps>) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      className={`post-card ${selected ? "selected" : ""}`}
    >
      <div className="post-header">
        <UserAvatar username={post.authorUsername} profilePictureUrl={post.authorProfilePictureUrl} />
        <div className="post-header-info">
          <span className="post-author">@{post.authorUsername}</span>
          <span className="post-time">· {new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="post-body">
        <p className="post-content">{post.content}</p>
      </div>

      <div className="post-actions">
        {onComment && (
          <button
            type="button"
            className="post-action-button comment"
            onClick={(e) => {
              e.stopPropagation();
              onComment();
            }}
          >
            💬 {post.commentCount ?? 0}
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
        >
          {likedByCurrentUser ? "❤️ Unlike" : "🤍 Like"} ({likes})
        </button>

        {onDelete && (
          <button
            type="button"
            className="post-action-button delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}
