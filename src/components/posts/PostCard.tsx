import { PostResponse } from "../../utils/types";

type PostCardProps = {
  post: PostResponse;
  selected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  likes: number;
  likedByCurrentUser: boolean;
  onToggleLike: () => void;
};

export default function PostCard({
  post,
  selected,
  onSelect,
  onDelete,
  likes,
  likedByCurrentUser,
  onToggleLike,
}: Readonly<PostCardProps>) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(); }}
      style={{
        border: selected ? "2px solid #333" : "1px solid #ccc",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        cursor: "pointer",
      }}
    >
      <p style={{ marginTop: 0 }}>{post.content}</p>
      <small style={{ color: "#666" }}>
        {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </small>

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
        >
          {likedByCurrentUser ? "❤️" : "🤍"} {likes}
        </button>

        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
