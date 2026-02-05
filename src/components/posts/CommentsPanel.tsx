import { useEffect, useState, RefObject } from "react";
import { CommentResponse } from "../../utils/types";
import { addComment, listComments } from "../../utils/PostApi";
import "../../styles/post.css";

type CommentsPanelProps = {
  postId: number;
  inputRef?: RefObject<HTMLInputElement | null>;
  onCommentCreated?: (postId: number) => Promise<void> | void;
};

export default function CommentsPanel({ postId, inputRef, onCommentCreated }: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await listComments(postId);
      setComments(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, postId]);

  const submit = async () => {
    if (!content.trim()) return;

    try {
      setError(null);
      setPosting(true);

      const created = await addComment(postId, { content: content.trim() });

      setComments((prev) => [created, ...prev]);
      setContent("");
      setOpen(true);

      await onCommentCreated?.(postId);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add comment");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ marginTop: 14 }}>
      <div className="comment-row">
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="button" className="post-btn primary" onClick={submit} disabled={posting}>
          {posting ? "Posting..." : "Comment"}
        </button>
      </div>

      {error && <div className="error-text">{error}</div>}

      <div className="comment-toggle">
        <button type="button" className="post-btn" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide comments" : "Show comments"}
        </button>
      </div>

      {open && (
        <div className="comment-list">
          {loading && <p>Loading comments...</p>}
          {!loading && comments.length === 0 && <p>No comments yet.</p>}

          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div>{c.content}</div>
              <small className="comment-meta">
                {c.authorUsername} · {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
