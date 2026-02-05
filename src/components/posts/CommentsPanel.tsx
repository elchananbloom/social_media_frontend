import { useEffect, useState, RefObject } from "react";
import { CommentResponse } from "../../utils/types";
import { addComment, listComments } from "../../utils/PostApi";
import UserAvatar from "../UserAvatar";
import "./CommentsPanel.css";

type CommentsPanelProps = {
  postId: number;
  inputRef?: RefObject<HTMLInputElement | null>;
  onCommentCreated?: (postId: number) => Promise<void> | void;
};

export default function CommentsPanel({
  postId,
  inputRef,
  onCommentCreated,
}: CommentsPanelProps) {
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
    <div className="comments-panel">
      <div className="comment-input-container">
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
        />
        <button type="button" onClick={submit} disabled={posting} className="comment-submit-button">
          {posting ? "Posting..." : "Comment"}
        </button>
      </div>

      {error && <p className="comment-error">{error}</p>}

      <button type="button" onClick={() => setOpen((v) => !v)} className="toggle-comments-button">
        {open ? "Hide comments" : "Show comments"}
      </button>

      {open && (
        <div className="comments-list">
          {loading && <p>Loading comments...</p>}
          {!loading && comments.length === 0 && <p>No comments yet.</p>}

          {comments.map((c) => (
            <div
              key={c.id}
              className="comment-item"
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <UserAvatar username={c.authorUsername} profilePictureUrl={c.authorProfilePictureUrl} size="small" />
                <div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "baseline" }}>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>@{c.authorUsername}</span>
                    <span className="comment-meta">· {new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="comment-content">{c.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
