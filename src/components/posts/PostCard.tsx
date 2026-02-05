import { PostResponse } from "../../utils/types";
import "../../styles/post.css";

type PostCardProps = {
  post: PostResponse;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onComment?: () => void;
};

export default function PostCard({
  post,
  selected,
  onSelect,
  onDelete,
  onComment,
}: Readonly<PostCardProps>) {
  return (
    <div
      className={`post-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <p className="post-content">{post.content}</p>

      {post.imageUrl && post.imageUrl.trim() !== "" && (
        <img
          src={post.imageUrl}
          alt="post"
          className="post-image"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      <div className="post-meta">
        {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </div>

      <div className="post-actions">
        {onComment && (
          <button
            type="button"
            className="post-btn"
            onClick={(e) => {
              e.stopPropagation();
              onComment();
            }}
          >
            💬 Comment ({post.commentCount ?? 0})
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="post-btn danger"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
