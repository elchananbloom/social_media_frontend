import { PostResponse } from "../../utils/types";

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
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
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

      {(onDelete || onComment) && (
        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          {onComment && (
            <button
              type="button"
              onClick={(e) => {
                console.log("Comment button clicked for post:", post.id);
                e.stopPropagation();
                onComment();
                console.log("onComment called");
              }}
            >
              Comment
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}