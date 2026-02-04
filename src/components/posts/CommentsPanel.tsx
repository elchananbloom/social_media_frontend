import { useEffect, useState, RefObject } from "react";
import { CommentResponse } from "../../utils/types";
import { addComment, listComments } from "../../utils/PostApi";

type CommentsPanelProps = {
  postId: number;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export default function CommentsPanel({ postId, inputRef }: CommentsPanelProps) {
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
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to add comment");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="button" onClick={submit} disabled={posting}>
          {posting ? "Posting..." : "Comment"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: 6 }}>{error}</p>}

      <button type="button" onClick={() => setOpen((v) => !v)} style={{ marginTop: 10 }}>
        {open ? "Hide comments" : "Show comments"}
      </button>

      {open && (
        <div style={{ marginTop: 10, borderTop: "1px solid #eee", paddingTop: 10 }}>
          {loading && <p>Loading comments...</p>}
          {!loading && comments.length === 0 && <p>No comments yet.</p>}

          {comments.map((c) => (
            <div key={c.id} style={{ borderTop: "1px solid #f1f1f1", marginTop: 10, paddingTop: 10 }}>
              <div>{c.content}</div>
              <small style={{ color: "#666" }}>
                {c.authorUsername} · {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
