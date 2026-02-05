import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";

type PostDetailProps = {
  post: PostResponse | null;
  likesMap: { [postId: number]: { count: number; likedByCurrentUser: boolean } };
  onToggleLike: (postId: number) => void;
};

export default function PostDetail({ post, likesMap, onToggleLike }: PostDetailProps) {
  if (!post) return <div><p>Select a post to see details</p></div>;

  const likes = likesMap[post.id]?.count ?? 0;
  const likedByCurrentUser = likesMap[post.id]?.likedByCurrentUser ?? false;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      <p>{post.content}</p>
      <small style={{ color: "#666" }}>
        {post.authorUsername} · {new Date(post.createdAt).toLocaleString()}
      </small>

      <div style={{ marginTop: 8 }}>
        <button onClick={() => onToggleLike(post.id)}>
          {likedByCurrentUser ? "❤️ Unlike" : "🤍 Like"} ({likes})
        </button>
      </div>

      <div style={{ marginTop: 8, color: "#666", fontSize: 12 }}>
        Comments: <b>{post.commentCount ?? 0}</b>
      </div>

      <CommentsPanel postId={post.id} />
    </div>
  );
}
