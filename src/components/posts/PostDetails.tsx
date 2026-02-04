import { useEffect, useRef } from "react";
import { PostResponse } from "../../utils/types";
import CommentsPanel from "./CommentsPanel";

export default function PostDetail({
  post,
  focusComment,
  onFocused,
}: {
  post: PostResponse | null;
  focusComment: boolean;
  onFocused: () => void;
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

      <CommentsPanel postId={post.id} inputRef={inputRef} />
    </div>
  );
}
