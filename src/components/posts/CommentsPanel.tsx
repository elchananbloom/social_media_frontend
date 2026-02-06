import { useEffect, useState, RefObject } from "react";
import { useNavigate } from "react-router-dom";
import { CommentResponse } from "../../utils/types";
import { addComment, listComments } from "../../utils/PostApi";
import { useAuth } from "../../hooks/useAuth";
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [content, setContent] = useState("");

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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async () => {
    if (!content.trim()) return;

    try {
      setError(null);
      setPosting(true);

      const created = await addComment(postId, { content: content.trim() });

      setComments((prev) => [created, ...prev]);

      setContent("");

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
        <div className="comment-input-avatar">
          {user && <UserAvatar username={user.username} profilePictureUrl={user.profilePictureUrl} size="small" />}
        </div>
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

      <div className="comments-list">
        {loading && <p>Loading comments...</p>}
        {!loading && comments.length === 0 && <p>No comments yet.</p>}

        {comments.map((c) => (
          <div
            key={c.id}
            className="comment-item"
          >
            <div className="comment-row">
              <UserAvatar username={c.authorUsername} profilePictureUrl={c.authorProfilePictureUrl} size="small" />
              <div>
                <div className="comment-header">
                  <span
                    className="comment-author"
                    onClick={() => navigate(`/profile/${c.authorUsername}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    @{c.authorUsername}
                  </span>
                  <span className="comment-meta">· {new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <div className="comment-content">{c.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
