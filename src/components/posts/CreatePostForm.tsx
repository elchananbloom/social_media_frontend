import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import UserAvatar from "../UserAvatar";
import "./CreatePostForm.css";

export default function CreatePostForm({
  onCreate,
}: {
  onCreate: (content: string, imageUrl?: string) => Promise<void> | void;
}) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!content.trim()) return;
    try {
      setSubmitting(true);
      await onCreate(content.trim(), imageUrl.trim() || undefined);
      setContent("");
      setImageUrl("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-row">
        <div className="create-post-avatar">
          {user && <UserAvatar username={user.username} profilePictureUrl={user.profilePictureUrl} size="medium" />}
        </div>
        <div className="create-post-content">
          <textarea
            placeholder="What is happening?!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="create-post-textarea"
          />

          <div className="create-post-divider"></div>

          <div className="create-post-footer">
            <input
              placeholder="Optional image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="create-post-input"
            />
            <button onClick={submit} disabled={submitting} className="post-submit-button">
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
