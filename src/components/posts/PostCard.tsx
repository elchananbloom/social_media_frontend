import { PostResponse } from "../../utils/types";
import UserAvatar from "../UserAvatar";
import "./PostCard.css";

type PostCardProps = {
  post: PostResponse;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  likes: number;
  likedByCurrentUser: boolean;
  onToggleLike: () => void;
  onComment?: () => void;
};

export default function PostCard({
  post,
  selected,
  onSelect,
  onDelete,
  likes,
  likedByCurrentUser,
  onToggleLike,
  onComment,
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
        {post.imageUrl && (
          <div className="post-image-container">
            <img src={post.imageUrl} alt="Post" className="post-image" />
          </div>
        )}
      </div>

      <div className="post-actions">
        <button
          className="post-action-button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike();
          }}
        >
          {likedByCurrentUser ? "❤️" : "🤍"} {likes}
        </button>

        <button
          type="button"
          className="post-action-button comment"
          onClick={(e) => {
            if (onComment) {
              e.stopPropagation();
              onComment();
            }
          }}
        >
          💬 {post.commentCount ?? 0}
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
